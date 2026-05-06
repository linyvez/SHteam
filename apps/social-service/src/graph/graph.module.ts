import { Module } from '@nestjs/common';
import { GraphController } from './graph.controller';
import { GraphService } from './graph.service';
import { KafkaController } from '../listeners/kafka.controller';

@Module({
  controllers: [GraphController, KafkaController],
  providers: [GraphService]
})
export class GraphModule {}
