import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShadersController } from './shaders.controller';
import { ShadersService } from './shaders.service';
import { Shader, ShaderSchema } from './schemas/shader.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Shader.name, schema: ShaderSchema }])],
  controllers: [ShadersController],
  providers: [ShadersService],
})
export class ShadersModule {}