import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { GraphService } from '../graph/graph.service';

@Controller()
export class KafkaController {
  constructor(private readonly graphService: GraphService) {}

  @EventPattern('shader.purchased')
  async handlePurchaseEvent(@Payload() message: any) {
    try {
      console.log('\n--- Incoming Kafka Event ---');
      
      let payload = message;
      
      if (message && message.value) {
        payload = message.value;
      }
      
      if (typeof payload === 'string') {
        payload = JSON.parse(payload);
      }

      if (!payload || !payload.userId || !payload.shaderId) {
        console.error('Invalid payload format. Missing userId or shaderId:', payload);
        return;
      }

      console.log(`Processing purchase: User [${payload.userId}] bought Shader [${payload.shaderId}]`);
      
      await this.graphService.recordPurchase(payload.userId, payload.shaderId);
      console.log('Successfully saved to Neo4j!');
      
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : JSON.stringify(error);
      console.error('Error processing Kafka event:', errMsg);
    }
  }
}