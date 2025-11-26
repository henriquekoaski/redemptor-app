import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for Expo Go and mobile devices
  app.enableCors({
    origin: true, // Allow all origins in development
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  const port = process.env.PORT ?? 3000;
  const host = process.env.HOST ?? '0.0.0.0'; // Listen on all interfaces for LAN access
  await app.listen(port, host);
  console.log(`🚀 Backend is running on http://${host === '0.0.0.0' ? 'localhost' : host}:${port}`);
}
bootstrap();
