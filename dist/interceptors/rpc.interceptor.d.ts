import { Reflector } from "@nestjs/core";
import { NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
export declare class RPCInterceptor implements NestInterceptor {
    private readonly reflector?;
    private readonly logger;
    /**
     * Constructor for RPCInterceptor.
     *
     * @param {Reflector} [reflector] - Optional NestJS Reflector for handling metadata.
     */
    constructor(reflector?: Reflector);
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
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
