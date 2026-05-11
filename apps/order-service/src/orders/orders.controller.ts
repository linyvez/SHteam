import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { CassandraService } from './cassandra.service';

@Controller('orders')
export class OrdersController {
    constructor(
      private readonly kafkaService: KafkaService,
      private readonly cassandraService: CassandraService,
    )  {}


    @Post('/api/orders/purchase')
    async postPurchase(@Body() body: { shaderId: string, userId: string }) {
      const { shaderId, userId } = body;
      const timestampMs = Date.now();
      const msg = {
        user_id: userId,
        shader_id: shaderId,
        event_time: timestampMs
      };
      await this.kafkaService.sendMessage('purchase_events', JSON.stringify(msg));

      return { status: 'ok' };
    }
  
    @Get('/api/orders/history')
    async getHistory(@Query('userId') userId: string) {
      const orders = await this.cassandraService.getOrders(userId);
      return { user_orders: orders };
    }
}
