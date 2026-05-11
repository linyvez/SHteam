import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './orders/orders.module';
import { OrdersService } from './orders/orders.service';
import { KafkaService } from './orders/kafka.service';
import { CassandraService } from './orders/cassandra.service';
import { OrdersController } from './orders/orders.controller';

@Module({
  imports: [OrdersModule],
  controllers: [AppController, OrdersController],
  providers: [AppService, KafkaService, CassandraService, OrdersService],
})
export class AppModule {}
