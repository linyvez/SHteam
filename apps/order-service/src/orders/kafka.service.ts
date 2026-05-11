import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs'

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
    private producer: Producer;

    async onModuleInit() {
        const kafka = new Kafka({
          clientId: 'order-service',
          brokers: [process.env.KAFKA_URL ?? 'localhost:9092']
        });
        this.producer = kafka.producer();
        await this.producer.connect();
    }

    async sendMessage(topic: string, msg:string) {
        await this.producer.send({
            topic,
            messages: [{ value: msg }]
        });
    }

    async onModuleDestroy() {
        await this.producer.disconnect();
    }
}