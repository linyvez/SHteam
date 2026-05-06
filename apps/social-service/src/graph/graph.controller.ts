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

  @Get('friends')
  async getFriends(@Query('userId') userId: string) {
    return this.graphService.getFriends(userId);
  }

  @Get('users/search')
  async searchUsers(@Query('q') query: string) {
    if (!query) return [];
    return this.graphService.searchUsers(query);
  }
}
