"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTPInterceptor = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const log_1 = require("../utils/log");
let HTTPInterceptor = class HTTPInterceptor {
    /**
     * Constructor for HTTPInterceptor.
     *
     * @param {Reflector} [reflector] - Optional NestJS Reflector for handling metadata.
     */
    constructor(reflector) {
        this.reflector = reflector;
    }
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
    intercept(context, next) {
        const startTime = Date.now();
        // Check if logging is skipped for this request
        const skip = this.reflector
            ? this.reflector.getAllAndOverride("skip-request-interceptor", [
                context.getHandler(),
                context.getClass()
            ])
            : false;
        const http = context.switchToHttp();
        const req = http.getRequest();
        const res = http.getResponse();
        return next.handle().pipe((0, operators_1.tap)(() => {
            const duration = Date.now() - startTime;
            const statusCodeColor = this.getStatusCodeColor(res.statusCode);
            if (!skip)
                (0, log_1.default)(`\x1b[34m${req.method}\x1b[0m ${req.url} ${statusCodeColor || "-"} ${res.getHeader("content-length") || "-"} ${duration}ms`);
        }), (0, operators_1.catchError)(error => {
            var _a;
            if (!error.status || error.status >= 500)
                console.error(error);
            const duration = Date.now() - startTime;
            const statusCode = error.status || error.statusCode || common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            const statusCodeColor = this.getStatusCodeColor(statusCode);
            let message = error.message || error;
            if ((_a = error.response) === null || _a === void 0 ? void 0 : _a.message) {
                if (typeof error.response.message === "string")
                    message = error.response.message;
                else
                    message = error.response.message.join(", ");
            }
            (0, log_1.default)(`\x1b[34m${req.method}\x1b[0m ${req.url} ${statusCodeColor || "-"} ${res.getHeader("content-length") || "-"} ${duration}ms \x1b[33m${message}\x1b[0m`);
            return (0, rxjs_1.throwError)(() => error);
        }));
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
    getStatusCodeColor(statusCode) {
        if (statusCode >= 200 && statusCode < 300) {
            return `\x1b[32m${statusCode}\x1b[0m`; // Green for 2xx
        }
        else if (statusCode >= 300 && statusCode < 400) {
            return `\x1b[34m${statusCode}\x1b[0m`; // Blue for 3xx
        }
        else if (statusCode >= 400 && statusCode < 500) {
            return `\x1b[33m${statusCode}\x1b[0m`; // Yellow for 4xx
        }
        else if (statusCode >= 500) {
            return `\x1b[31m${statusCode}\x1b[0m`; // Red for 5xx
        }
        else {
            return `${statusCode}`; // Default no color
        }
    }
};
exports.HTTPInterceptor = HTTPInterceptor;
exports.HTTPInterceptor = HTTPInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Optional)()),
    __param(0, (0, common_1.Inject)(core_1.Reflector)),
    __metadata("design:paramtypes", [core_1.Reflector])
], HTTPInterceptor);
//# sourceMappingURL=http.interceptor.js.map