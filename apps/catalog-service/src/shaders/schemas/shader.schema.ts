import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ShaderDocument = HydratedDocument<Shader>;

@Schema({ timestamps: true })
export class Shader {
  @Prop({ required: true })
  title!: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  authorId!: string;

  @Prop({ required: true, default: 0 })
  price!: number;

  @Prop({ required: true })
  vertexShader!: string;

  @Prop({ required: true })
  fragmentShader!: string;

  @Prop()
  thumbnailUrl?: string;
}

export const ShaderSchema = SchemaFactory.createForClass(Shader);
