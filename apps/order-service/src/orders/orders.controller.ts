import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { CassandraService } from './cassandra.service';
import { v4 as uuidv4 } from 'uuid';

@Controller('/api/orders')
export class OrdersController {
  constructor(
    private readonly kafkaService: KafkaService,
    private readonly cassandraService: CassandraService,
  ) {}

  @Post('/purchase')
  async postPurchase(
    @Body() body: { shaderId: string; userId: string; price: number },
  ) {
    const { shaderId, userId, price } = body;

    const orderId = uuidv4();

    const timestampMs = Date.now();
    const msg = {
      order_id: orderId,
      user_id: userId,
      shader_id: shaderId,
      price: price,
      event_time: timestampMs,
    };
    await this.kafkaService.sendMessage('ORDER_INITIATED', JSON.stringify(msg));

    return { status: 'pending', orderId };
  }

  @Get('/history')
  async getHistory(@Query('userId') userId: string) {
    const orders = await this.cassandraService.getOrders(userId);
    return { user_orders: orders };
  }
}
