import { Reflector } from "@nestjs/core";
import { NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
export declare class RPCInterceptor implements NestInterceptor {
    private readonly reflector?;
    constructor(reflector?: Reflector);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
