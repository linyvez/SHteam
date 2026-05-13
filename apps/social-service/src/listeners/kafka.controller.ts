import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { GraphService } from '../graph/graph.service';

@Controller()
export class KafkaController {
  constructor(private readonly graphService: GraphService) { }

  @EventPattern('FUNDS_RESERVED')
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

      const userId = payload.user_id || payload.userId;
      const shaderId = payload.shader_id || payload.shaderId;

      if (!userId || !shaderId) {
        console.error('Invalid payload format. Missing ID data:', payload);
        return;
      }

      console.log(`Mapping Neo4j Graph: User [${userId}] bought Shader [${shaderId}]`);

      await this.graphService.recordPurchase(userId, shaderId);
      console.log('Successfully saved to Neo4j!');

    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : JSON.stringify(error);
      console.error('Error processing Kafka event:', errMsg);
    }
  }
}