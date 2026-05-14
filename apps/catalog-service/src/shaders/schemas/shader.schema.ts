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
  authorId!: string; // Will later link to Identity Service

  @Prop({ required: true, default: 0 })
  price!: number;

  @Prop({ required: true })
  vertexShader!: string; // The GLSL code for the vertex shader

  @Prop({ required: true })
  fragmentShader!: string; // The GLSL code for the fragment shader

  @Prop()
  thumbnailUrl?: string;
}

export const ShaderSchema = SchemaFactory.createForClass(Shader);