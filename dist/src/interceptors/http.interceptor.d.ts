import { NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
export declare class HTTPInterceptor implements NestInterceptor {
    private readonly reflector?;
    constructor(reflector?: Reflector);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    private getStatusCodeColor;
}
