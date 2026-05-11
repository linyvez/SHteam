import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs'

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
    private kafka: Kafka;
    private producer: Producer;

    async onModuleInit() {
        this.kafka = new Kafka({
          clientId: 'order-service',
          brokers: [process.env.KAFKA_URL ?? 'localhost:9092']
        });
        this.producer = this.kafka.producer();
        await this.producer.connect();
    }

    async sendMessage(topic: string, msg:string) {
        await this.producer.send({
            topic,
            messages: [{ value: msg }]
        });
    }

    createConsumer(group: string) {
        return this.kafka.consumer({ groupId: group });
    }

    async onModuleDestroy() {
        await this.producer.disconnect();
    }
}