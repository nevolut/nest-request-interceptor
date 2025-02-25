/**
 * @module nest-request-interceptor
 *
 * This module provides request interceptors for HTTP and RPC communication in NestJS applications.
 * It includes logging utilities and a decorator to selectively skip logging.
 */
import { SkipLogging } from "./decorators/skip-logging";
import { HTTPInterceptor } from "./interceptors/http.interceptor";
import { RPCInterceptor } from "./interceptors/rpc.interceptor";
import log from "./utils/log";
/**
 * HTTPInterceptor - Logs HTTP requests and responses, capturing status codes, response times, and errors.
 */
export { HTTPInterceptor };
/**
 * RPCInterceptor - Logs RPC (microservices) requests and responses, including execution duration and errors.
 */
export { RPCInterceptor };
/**
 * SkipLogging - Decorator to disable logging on specific methods or controllers.
 */
export { SkipLogging };
/**
 * Log - Utility function for logging with timestamp formatting.
 */
export { log as Log };
