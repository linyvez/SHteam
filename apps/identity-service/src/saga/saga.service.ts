// apps/identity-service/src/saga/saga.service.ts
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Kafka, Consumer, Producer } from 'kafkajs';
import { UsersService } from '../users/users.service';

@Injectable()
export class SagaService implements OnModuleInit {
    private readonly logger = new Logger(SagaService.name);
    private kafka: Kafka;
    private consumer: Consumer;
    private producer: Producer;

    constructor(
        private readonly usersService: UsersService,
    ) {
        this.kafka = new Kafka({
            clientId: 'identity-service',
            brokers: [process.env.KAFKA_URL ?? 'shteam-kafka:9092']
        });
        this.consumer = this.kafka.consumer({ groupId: 'identity-group' });
        this.producer = this.kafka.producer();
    }

    async onModuleInit() {
        await this.producer.connect();
        await this.consumer.connect();

        // Listen to the Order Service!
        await this.consumer.subscribe({ topic: 'ORDER_INITIATED', fromBeginning: false });

        await this.consumer.run({
            eachMessage: async ({ message }) => {
                if (!message.value) return;
                const event = JSON.parse(message.value.toString());
                await this.handleOrderInitiated(event);
            },
        });
    }

    private async handleOrderInitiated(event: any) {
        const { user_id, shader_id, price, event_time } = event;

        // 1. Find the user
        const user = await this.usersService.findById(user_id);

        // 2. Check Balance
        if (user && user.balance >= price) {
            // 3a. Success: Deduct funds and save to Postgres
            user.balance = Number(user.balance) - Number(price);
            await this.usersService.save(user);

            this.logger.log(`Funds deducted for user ${user_id}. Publishing FUNDS_RESERVED.`);

            // 4a. Tell the Order Service to finalize the purchase!
            await this.producer.send({
                topic: 'FUNDS_RESERVED',
                messages: [{ value: JSON.stringify(event) }]
            });
        } else {
            // 3b. Failure: Not enough money
            this.logger.warn(`Insufficient funds for user ${user_id}. Publishing INSUFFICIENT_FUNDS.`);

            // 4b. Tell the system it failed (Order service could listen to this to notify the user later)
            await this.producer.send({
                topic: 'INSUFFICIENT_FUNDS',
                messages: [{ value: JSON.stringify(event) }]
            });
        }
    }
}