"use strict";
/**
 * @module nest-request-interceptor
 *
 * This module provides request interceptors for HTTP and RPC communication in NestJS applications.
 * It includes logging utilities and a decorator to selectively skip logging.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = exports.SkipLogging = exports.RPCInterceptor = exports.HTTPInterceptor = void 0;
const skip_logging_1 = require("./decorators/skip-logging");
Object.defineProperty(exports, "SkipLogging", { enumerable: true, get: function () { return skip_logging_1.SkipLogging; } });
const http_interceptor_1 = require("./interceptors/http.interceptor");
Object.defineProperty(exports, "HTTPInterceptor", { enumerable: true, get: function () { return http_interceptor_1.HTTPInterceptor; } });
const rpc_interceptor_1 = require("./interceptors/rpc.interceptor");
Object.defineProperty(exports, "RPCInterceptor", { enumerable: true, get: function () { return rpc_interceptor_1.RPCInterceptor; } });
const log_1 = require("./utils/log");
exports.Log = log_1.default;
//# sourceMappingURL=index.js.map