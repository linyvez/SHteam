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
    await this.consumer.subscribe({
      topic: 'FUNDS_RESERVED',
      fromBeginning: false,
    });
    await this.consumer.subscribe({
      topic: 'INSUFFICIENT_FUNDS',
      fromBeginning: false,
    });

    await this.consumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        const { topic, message } = payload;
        if (!message.value) return;
        const event = JSON.parse(message.value.toString());

        try {
          if (topic === 'FUNDS_RESERVED') {
            await this.cassandraService.writeOrder(
              event['order_id'],
              event['user_id'],
              event['shader_id'],
              new Date(event['event_time']),
            );
            this.logger.log(`Order ${event['order_id']} finalized.`);
          } else if (topic === 'INSUFFICIENT_FUNDS') {
            this.logger.warn(`Order ${event['order_id']} failed: Low balance.`);
          }
        } catch (err) {
          this.logger.error(
            `CASSANDRA DOWN! Reverting funds for ${event['order_id']}`,
            err,
          );

          await this.kafkaService.sendMessage(
            'ORDER_REVERT_FUNDS',
            JSON.stringify(event),
          );
        }
      },
    });
    this.logger.log('Kafka consumer started for FUNDS_RESERVED');
  }
}
