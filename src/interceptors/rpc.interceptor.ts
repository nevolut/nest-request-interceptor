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

  /**
   * Constructor for RPCInterceptor.
   *
   * @param {Reflector} [reflector] - Optional NestJS Reflector for handling metadata.
   */
  constructor(@Optional() @Inject(Reflector) private readonly reflector?: Reflector) {}

  /**
   * Intercepts incoming RPC requests and logs relevant details.
   *
   * Logs:
   * - Message ID (if available)
   * - RPC pattern
   * - Execution time
   * - Errors (if any)
   *
   * @param {ExecutionContext} context - Execution context of the RPC request.
   * @param {CallHandler} next - Next handler in the request pipeline.
   * @returns {Observable<any>} Observable with request response or error.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();

    // Check if logging is skipped for this request
    const skip = this.reflector
      ? this.reflector.getAllAndOverride<boolean>("skip-request-interceptor", [
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
    } catch (error) {
      this.logger.error(`Error parsing message content: ${error.message}`);
      return next.handle();
    }

    if (!skip)
      this.logger.log(`\x1b[34m${id ? "REQUEST" : "RECEIVED"}\x1b[0m ${id || "-"} ${pattern}`);

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        if (!skip)
          this.logger.log(
            `\x1b[32m${id ? "SEND" : "EMIT"}\x1b[0m ${id || "-"} ${pattern} ${duration}ms`
          );
      }),
      catchError(error => {
        if (!error.status || error.status >= 500) console.error(error);

        const duration = Date.now() - startTime;
        let message = error.message || error;

        if (error.response?.message) {
          if (typeof error.response.message === "string") message = error.response.message;
          else message = error.response.message.join(", ");
        }

        this.logger.error(
          `\x1b[31m${id ? "SEND" : "EMIT"}\x1b[0m ${
            id || "-"
          } ${pattern} ${duration}ms - \x1b[33m${message}\x1b[0m`
        );

        throw new RpcException(message);
      })
    );
  }
}
