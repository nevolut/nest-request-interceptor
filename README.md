# nest-request-interceptor

Lightweight HTTP and RPC request logging interceptors for NestJS. Color-coded, zero-config, with decorators to silence or deduplicate noisy routes.

## Install

```sh
npm install nest-request-interceptor
```

## Quick Start

```typescript
import { NestFactory, Reflector } from "@nestjs/core";
import { HTTPInterceptor, RPCInterceptor } from "nest-request-interceptor";

// HTTP
const app = await NestFactory.create(AppModule);
app.useGlobalInterceptors(new HTTPInterceptor(app.get(Reflector)));

// RPC (microservices)
const micro = await NestFactory.createMicroservice(AppModule, { transport: Transport.RMQ, ... });
micro.useGlobalInterceptors(new RPCInterceptor());
```

## Log Output

```
[HTTPInterceptor] POST /api/users 201 12ms
[HTTPInterceptor] GET  /api/users 200 3ms
[HTTPInterceptor] GET  /api/users/999 404 2ms — User not found
[RPCInterceptor] RECEIVED - chats:request
[RPCInterceptor] EMIT - chats:request 1523ms
[RPCInterceptor] REQUEST abc123 customers:read
[RPCInterceptor] SEND abc123 customers:read 8ms
```

**Colors:** green (2xx), blue (3xx), yellow (4xx), red (5xx).

## Decorators

### `@SkipLogging()`

Completely silences logging for a route. No logs at all.

```typescript
import { SkipLogging } from "nest-request-interceptor";

@SkipLogging()
@Get("internal/metrics")
metrics() { return this.metricsService.collect(); }
```

### `@SkipNoise()`

Logs the first request, then suppresses identical subsequent requests. Logs again when the response status changes or an error occurs. Ideal for health checks and readiness probes.

```typescript
import { SkipNoise } from "nest-request-interceptor";

@SkipNoise()
@Get("health-check")
healthCheck() { return { status: "ok" }; }
```

**Behavior:**
- First `GET /health-check` → logged
- Next 1000 identical `GET /health-check 200` → suppressed
- `GET /health-check 500` (error) → logged, cache reset
- Next `GET /health-check 200` → logged again

### Combining

```typescript
@SkipLogging()   // never log — use for internal/debug routes
@SkipNoise()     // log once — use for probes and polling endpoints
// (no decorator) // always log — default for all routes
```

## API

| Export | Type | Description |
|---|---|---|
| `HTTPInterceptor` | `NestInterceptor` | Logs HTTP method, URL, status, duration |
| `RPCInterceptor` | `NestInterceptor` | Logs RPC pattern, message ID, duration |
| `SkipLogging` | Decorator | Suppress all logging for a route |
| `SkipNoise` | Decorator | Deduplicate identical log entries |
| `Log` | Function | Timestamped console.log utility |

## Compatibility

- NestJS 10, 11+
- TypeScript 5, 6
- Express 4, 5
- Any RMQ/Redis/NATS transport

## License

MIT
