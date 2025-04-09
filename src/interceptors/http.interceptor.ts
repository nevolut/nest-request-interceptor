import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
  Injectable,
  Inject,
  Optional,
  Logger
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request, Response } from "express";
import { Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";

@Injectable()
export class HTTPInterceptor implements NestInterceptor {
  private readonly logger = new Logger(HTTPInterceptor.name);

  /**
   * Constructor for HTTPInterceptor.
   *
   * @param {Reflector} [reflector] - Optional NestJS Reflector for handling metadata.
   */
  constructor(@Optional() @Inject(Reflector) private readonly reflector?: Reflector) {}

  /**
   * Intercepts incoming HTTP requests and logs relevant details.
   *
   * Logs:
   * - HTTP method
   * - URL
   * - Status code (color-coded)
   * - Response time
   * - Response size (if available)
   * - Errors (if any)
   *
   * @param {ExecutionContext} context - Execution context of the HTTP request.
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

    const http = context.switchToHttp();
    const req: Request = http.getRequest();
    const res: Response = http.getResponse();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        const statusCodeColor = this.getStatusCodeColor(res.statusCode);
        if (!skip)
          this.logger.log(
            `\x1b[34m${req.method}\x1b[0m ${req.url} ${statusCodeColor || "-"} ${
              res.getHeader("content-length") || "-"
            } ${duration}ms`
          );
      }),
      catchError(error => {
        if (!error.status || error.status >= 500) console.error(error);

        const duration = Date.now() - startTime;
        const statusCode = error.status || error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
        const statusCodeColor = this.getStatusCodeColor(statusCode);
        let message = error.message || error;
        if (error.response?.message) {
          if (typeof error.response.message === "string") message = error.response.message;
          else message = error.response.message.join(", ");
        }

        this.logger.error(
          `\x1b[34m${req.method}\x1b[0m ${req.url} ${statusCodeColor || "-"} ${
            res.getHeader("content-length") || "-"
          } ${duration}ms \x1b[33m${message}\x1b[0m`
        );
        return throwError(() => error);
      })
    );
  }

  /**
   * Returns an ANSI color-coded string for the given HTTP status code.
   *
   * Colors:
   * - Green (2xx): Successful responses
   * - Blue (3xx): Redirections
   * - Yellow (4xx): Client errors
   * - Red (5xx): Server errors
   *
   * @param {number} statusCode - HTTP response status code.
   * @returns {string} Color-coded status code string.
   */
  private getStatusCodeColor(statusCode: number): string {
    if (statusCode >= 200 && statusCode < 300) {
      return `\x1b[32m${statusCode}\x1b[0m`; // Green for 2xx
    } else if (statusCode >= 300 && statusCode < 400) {
      return `\x1b[34m${statusCode}\x1b[0m`; // Blue for 3xx
    } else if (statusCode >= 400 && statusCode < 500) {
      return `\x1b[33m${statusCode}\x1b[0m`; // Yellow for 4xx
    } else if (statusCode >= 500) {
      return `\x1b[31m${statusCode}\x1b[0m`; // Red for 5xx
    } else {
      return `${statusCode}`; // Default no color
    }
  }
}
