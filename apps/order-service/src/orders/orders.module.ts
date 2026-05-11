import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { CassandraService } from './cassandra.service';
import { KafkaService } from './kafka.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, KafkaService, CassandraService]
})
export class OrdersModule {}
