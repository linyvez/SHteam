import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { CassandraService } from './cassandra.service';
import { Consumer, EachMessagePayload } from 'kafkajs';

@Injectable()
export class OrdersService implements OnModuleInit {
	private readonly logger = new Logger(OrdersService.name);
	private consumer: Consumer;

	constructor(
		private readonly kafkaService: KafkaService,
		private readonly cassandraService: CassandraService,
	) {}

	async onModuleInit() {
		this.consumer = this.kafkaService.createConsumer('order-events-group');
		await this.consumer.connect();
		await this.consumer.subscribe({ topic: 'purchase_events', fromBeginning: false });

		await this.consumer.run({
			eachMessage: async (payload: EachMessagePayload) => {
				const { message } = payload;
				try {
                    if (message.value) {
                        const event = JSON.parse(message.value.toString());
                        this.logger.log(`Received event: ${JSON.stringify(event)}`);
                        await this.cassandraService.writeOrder(event['user_id'], event['shader_id'], event['event_time']);
                    }
				} catch (err) {
					this.logger.error('Failed to process Kafka message', err);
				}
			},
		});
		this.logger.log('Kafka consumer started for purchase_events');
	}
}