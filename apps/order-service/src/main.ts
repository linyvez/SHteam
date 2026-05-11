import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const PORT = process.env.PORT ?? 3001;
  await app.listen(PORT, '0.0.0.0');
  console.log(`Order Service is running on: http://localhost:${PORT}`);
}
bootstrap();
