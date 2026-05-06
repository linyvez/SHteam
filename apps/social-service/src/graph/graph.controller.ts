import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { GraphService } from './graph.service';

@Controller('api/social')
export class GraphController {
  constructor(private readonly graphService: GraphService) {}

  @Post('friends/add')
  async addFriend(@Body() body: { userId: string; friendId: string }) {
    return this.graphService.addFriend(body.userId, body.friendId);
  }

  @Get('recommendations')
  async getRecommendations(@Query('userId') userId: string) {
    return this.graphService.getRecommendations(userId);
  }
}
