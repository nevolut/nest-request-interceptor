# Nest Request Interceptor

## Overview

`nest-request-interceptor` is a logging interceptor package for NestJS applications. It provides HTTP and RPC interceptors that log request and response details, including execution time, status codes, and error messages. The package also includes a decorator to skip logging when necessary.

## Features

- **HTTPInterceptor**: Logs HTTP requests and responses with status codes, execution times, and response sizes.
- **RPCInterceptor**: Logs RPC requests and responses, including message patterns and execution times.
- **SkipLogging Decorator**: Allows skipping logging for specific methods or controllers.
- **Custom Logging Utility**: Uses ANSI color-coded console logs for better readability.

## Installation

```sh
npm install nest-request-interceptor
```

## Usage

### Import the Interceptors

To enable logging for all requests in your NestJS application, register the interceptors globally.

```typescript
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HTTPInterceptor } from 'nest-request-interceptor';
import { RPCInterceptor } from 'nest-request-interceptor';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: HTTPInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RPCInterceptor,
    },
  ],
})
export class AppModule {}
```

### HTTP Server Bootstrap

For HTTP applications, register the HTTP interceptor in the main bootstrap function:

```typescript
import { NestFactory, Reflector } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import { HTTPInterceptor } from "nest-request-interceptor";

async function bootstrapHttp() {
  const app = await NestFactory.create(AppModule);

  const reflector = app.get(Reflector); // Get the Reflector instance, use it to enable skipping logging feature
  app.useGlobalInterceptors(new HTTPInterceptor(reflector));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(3000);
  console.log("HTTP server is running on: http://localhost:3000");
}

bootstrapHttp();
```

### RPC Server Bootstrap

For microservices using RabbitMQ or another transport, register the RPC interceptor:

```typescript
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { RPCInterceptor } from "nest-request-interceptor";
import { Transport, MicroserviceOptions } from "@nestjs/microservices";

async function bootstrapRpc() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ["amqp://localhost:5672"],
      queue: "main_queue",
      queueOptions: { durable: false },
    },
  });

  app.useGlobalInterceptors(new RPCInterceptor());

  await app.listen();
  console.log("RPC server is running and connected to RabbitMQ");
}

bootstrapRpc();
```

### Skip Logging for Specific Endpoints

Use the `@SkipLogging()` decorator to disable logging for specific methods or controllers.

```typescript
import { Controller, Get } from '@nestjs/common';
import { SkipLogging } from 'nest-request-interceptor';

@Controller('example')
export class ExampleController {
  @Get()
  @SkipLogging()
  getData() {
    return { message: 'This request will not be logged' };
  }
}
```

Determines whether to skip logging (`true` to disable logging, `false` to keep logging active).
```typescript
 import { Controller, Get } from "@nestjs/common";
 import { SkipLogging } from "./decorators/skip-logging";

 @Controller("users")
 export class UserController {

   // Logging is skipped for this method
   @Get("hidden")
   @SkipLogging()
   hiddenRoute() {
     return { message: "This request will not be logged" };
   }

   // Logging remains active for this method
   @Get("public")
   @SkipLogging(false)
   publicRoute() {
     return { message: "This request will be logged" };
   }
 }
```

### Logging Format

The logs are color-coded for easy readability:
- **Blue**: Incoming requests
- **Green**: Successful responses
- **Yellow**: Client errors (4xx)
- **Red**: Server errors (5xx)

Example output:

```sh
[ 2025/02/25 14:30:00 ] - REQUEST GET /users
[ 2025/02/25 14:30:01 ] - SEND GET /users 200 45ms
```

## API Reference

### `HTTPInterceptor`

- Logs HTTP requests and responses
- Shows execution time and response status

### `RPCInterceptor`

- Logs RPC requests and responses
- Captures message patterns and execution duration

### `SkipLogging`

- Decorator to disable logging on specific methods

## License

MIT License

