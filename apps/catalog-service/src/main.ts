import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS so your React frontend can communicate with this service
  app.enableCors({
    origin: 'http://localhost:5173', // Your Vite frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
  console.log(`Catalog Service is running on: http://localhost:3000`);
}
bootstrap();