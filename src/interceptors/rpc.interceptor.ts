import { Reflector } from "@nestjs/core";
import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
  Inject,
  Optional,
  Logger
} from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { catchError, tap } from "rxjs/operators";

@Injectable()
export class RPCInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RPCInterceptor.name);
  private readonly noiseCache = new Map<string, string>();

  constructor(@Optional() @Inject(Reflector) private readonly reflector?: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();

    const skip = this.reflector
      ? this.reflector.getAllAndOverride<boolean>("skip-request-interceptor", [
          context.getHandler(),
          context.getClass()
        ])
      : false;

    const skipNoise = this.reflector
      ? this.reflector.getAllAndOverride<boolean>("skip-noise-interceptor", [
          context.getHandler(),
          context.getClass()
        ])
      : false;

    const rpc = context.switchToRpc();
    const ctx = rpc.getContext();
    const msg = ctx.getMessage();
    let id: string | undefined;
    let pattern: string | undefined;

    try {
      const data = JSON.parse(msg.content.toString());
      id = data.id;
      pattern = data.pattern;
    } catch (error: unknown) {
      this.logger.error(`Error parsing message content: ${(error as Error).message}`);
      return next.handle();
    }

    if (!skip && !skipNoise)
      this.logger.log(`\x1b[34m${id ? "REQUEST" : "RECEIVED"}\x1b[0m ${id || "-"} ${pattern}`);

    return next.handle().pipe(
      tap(() => {
        if (skip) return;
        const duration = Date.now() - startTime;
        const tag = id ? "SEND" : "EMIT";
        const logLine = `\x1b[32m${tag}\x1b[0m ${id || "-"} ${pattern} ${duration}ms`;

        if (skipNoise && pattern) {
          const sig = `${pattern}:ok`;
          if (this.noiseCache.get(pattern) === sig) return;
          this.noiseCache.set(pattern, sig);
        }

        this.logger.log(logLine);
      }),
      catchError(error => {
        if (!error.status || error.status >= 500) console.error(error);

        const duration = Date.now() - startTime;
        let message = error.message || error;

        if (error.response?.message) {
          if (typeof error.response.message === "string") message = error.response.message;
          else message = error.response.message.join(", ");
        }

        if (!skip) {
          this.logger.error(
            `\x1b[31m${id ? "SEND" : "EMIT"}\x1b[0m ${id || "-"} ${pattern} ${duration}ms - \x1b[33m${message}\x1b[0m`
          );
        }

        // Reset noise cache on error so next success logs
        if (skipNoise && pattern) this.noiseCache.delete(pattern);

        throw new RpcException(message);
      })
    );
  }
}
