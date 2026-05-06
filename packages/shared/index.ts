export interface User {
  id: string;
  email: string;
  role: string;
}

export interface Shader {
  _id: string;
  title: string;
  description?: string;
  authorId: string;
  price: number;
  vertexShader: string;
  fragmentShader: string;
  thumbnailUrl?: string;
  createdAt?: string;
}