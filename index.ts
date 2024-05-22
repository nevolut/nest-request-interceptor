import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus
} from "@nestjs/common";
import { Request, Response } from "express";
import { Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import log from "./log";

export class NestHTTPInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();

    const http = context.switchToHttp();
    const req: Request = http.getRequest();
    const res: Response = http.getResponse();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        const statusCodeColor = this.getStatusCodeColor(res.statusCode);
        log(
          `\x1b[34m${req.method}\x1b[0m ${req.url} ${statusCodeColor || "-"} ${
            res.getHeader("content-length") || "-"
          } ${duration}ms`
        );
      }),
      catchError(error => {
        console.error(error);

        const duration = Date.now() - startTime;
        const statusCode = error.status || error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
        const statusCodeColor = this.getStatusCodeColor(statusCode);
        let message = error.message || error;
        if (error.response?.message) {
          if (typeof error.response.message === "string") message = error.response.message;
          else message = error.response.message.join(", ");
        }

        log(
          `\x1b[34m${req.method}\x1b[0m ${req.url} ${statusCodeColor || "-"} ${
            res.getHeader("content-length") || "-"
          } ${duration}ms \x1b[33m${message}\x1b[0m`
        );
        return throwError(() => new HttpException(message, statusCode));
      })
    );
  }

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
