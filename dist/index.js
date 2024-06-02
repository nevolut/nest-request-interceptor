"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NestHTTPInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const log_1 = require("./log");
class NestHTTPInterceptor {
    intercept(context, next) {
        const startTime = Date.now();
        const http = context.switchToHttp();
        const req = http.getRequest();
        const res = http.getResponse();
        return next.handle().pipe((0, operators_1.tap)(() => {
            const duration = Date.now() - startTime;
            const statusCodeColor = this.getStatusCodeColor(res.statusCode);
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
            return (0, rxjs_1.throwError)(() => new common_1.HttpException(message, statusCode));
        }));
    }
    getStatusCodeColor(statusCode) {
        if (statusCode >= 200 && statusCode < 300) {
            return `\x1b[32m${statusCode}\x1b[0m`;
        }
        else if (statusCode >= 300 && statusCode < 400) {
            return `\x1b[34m${statusCode}\x1b[0m`;
        }
        else if (statusCode >= 400 && statusCode < 500) {
            return `\x1b[33m${statusCode}\x1b[0m`;
        }
        else if (statusCode >= 500) {
            return `\x1b[31m${statusCode}\x1b[0m`;
        }
        else {
            return `${statusCode}`;
        }
    }
}
exports.NestHTTPInterceptor = NestHTTPInterceptor;
//# sourceMappingURL=index.js.map