import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Kafka, Consumer, Producer } from 'kafkajs';
import { UsersService } from '../users/users.service';
import { ProcessedOrder } from './processed-order.entity';
import { User } from 'src/users/user.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class SagaService implements OnModuleInit {
  private readonly logger = new Logger(SagaService.name);
  private kafka: Kafka;
  private consumer: Consumer;
  private producer: Producer;

  constructor(
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
  ) {
    this.kafka = new Kafka({
      clientId: 'identity-service',
      brokers: [process.env.KAFKA_URL ?? 'shteam-kafka:9092'],
    });
    this.consumer = this.kafka.consumer({ groupId: 'identity-group' });
    this.producer = this.kafka.producer();
  }

  async onModuleInit() {
    await this.producer.connect();
    await this.consumer.connect();

    await this.consumer.subscribe({
      topic: 'ORDER_INITIATED',
      fromBeginning: false,
    });
    await this.consumer.subscribe({
      topic: 'ORDER_REVERT_FUNDS',
      fromBeginning: false,
    });

    await this.consumer.run({
      eachMessage: async ({ topic, message }) => {
        if (!message.value) return;
        const event = JSON.parse(message.value.toString());

        if (topic === 'ORDER_INITIATED') {
          await this.handleOrderInitiated(event);
        } else if (topic === 'ORDER_REVERT_FUNDS') {
          await this.handleRefund(event);
        }
      },
    });
  }

  private async handleOrderInitiated(event: any) {
    const { order_id, user_id, price } = event;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existing = await queryRunner.manager.findOne(ProcessedOrder, {
        where: { order_id },
      });
      if (existing) {
        this.logger.warn(
          `Order ${order_id} already processed. Ignoring duplicate.`,
        );
        await queryRunner.release();
        return;
      }

      const user = await queryRunner.manager.findOne(User, {
        where: { id: user_id },
      });

      if (user && user.balance >= price) {
        user.balance = Number(user.balance) - Number(price);
        await queryRunner.manager.save(user);

        const processed = new ProcessedOrder();
        processed.order_id = order_id;
        processed.user_id = user_id;
        await queryRunner.manager.save(processed);

        await queryRunner.commitTransaction();

        this.logger.log(
          `Funds deducted for user ${user_id}. Publishing FUNDS_RESERVED.`,
        );
        await this.producer.send({
          topic: 'FUNDS_RESERVED',
          messages: [{ value: JSON.stringify(event) }],
        });
      } else {
        this.logger.warn(
          `Insufficient funds for user ${user_id}. Publishing INSUFFICIENT_FUNDS.`,
        );
        await this.producer.send({
          topic: 'INSUFFICIENT_FUNDS',
          messages: [{ value: JSON.stringify(event) }],
        });
      }
    } catch (err) {
      this.logger.error(
        `Transaction failed for order ${order_id}. Rolling back Postgres.`,
        err,
      );
      await queryRunner.rollbackTransaction();
    } finally {
      if (!queryRunner.isReleased) {
        await queryRunner.release();
      }
    }
  }

  private async handleRefund(event: any) {
    const { user_id, price, order_id } = event;
    const user = await this.usersService.findById(user_id);
    if (user) {
      user.balance = Number(user.balance) + Number(price);
      await this.usersService.save(user);
      this.logger.log(`Refunded order ${order_id} for user ${user_id}`);
    }
  }
}
