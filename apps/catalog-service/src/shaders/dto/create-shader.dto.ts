export class CreateShaderDto {
  readonly title!: string;
  readonly description?: string;
  readonly authorId!: string;
  readonly price!: number;
  readonly vertexShader!: string;
  readonly fragmentShader!: string;
  readonly thumbnailUrl?: string;
}