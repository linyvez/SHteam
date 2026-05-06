import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { GraphService } from '../graph/graph.service';

@Controller()
export class KafkaController {
  constructor(private readonly graphService: GraphService) {}

  @EventPattern('shader.purchased')
  async handlePurchaseEvent(@Payload() message: any) {
    console.log(`Kafka Event received: User ${message.userId} bought Shader ${message.shaderId}`);
    await this.graphService.recordPurchase(message.userId, message.shaderId);
  }
}