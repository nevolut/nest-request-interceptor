import { NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
export declare class HTTPInterceptor implements NestInterceptor {
    private readonly reflector?;
    private readonly logger;
    private readonly noiseCache;
    constructor(reflector?: Reflector);
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
