import { Controller, Get, Post } from '@nestjs/common';

@Controller('orders')
export class OrdersController {
    @Post('/api/orders/purchase')
      postPurchase(): string {
        return 'purchased successfully'
      }
    
      @Get('/api/orders/history')
      getHistory(user_id: string): string {
        return 'user history...';
      }
}
