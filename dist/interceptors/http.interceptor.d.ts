import { NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
export declare class HTTPInterceptor implements NestInterceptor {
    private readonly reflector?;
    /**
     * Constructor for HTTPInterceptor.
     *
     * @param {Reflector} [reflector] - Optional NestJS Reflector for handling metadata.
     */
    constructor(reflector?: Reflector);
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
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
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
    private getStatusCodeColor;
}
