import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const PORT: number = +process.env.PORT_BEN;
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        port: PORT,
      },
    }
  );
  await app.listen();
  Logger.log(`🚀 Microservice is running on: http://localhost:${PORT}`);
}
bootstrap();
