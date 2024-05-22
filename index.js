"use strict";
exports.__esModule = true;
exports.NestHTTPInterceptor = void 0;
var common_1 = require("@nestjs/common");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var log_1 = require("./log");
var NestHTTPInterceptor = /** @class */ (function () {
    function NestHTTPInterceptor() {
    }
    NestHTTPInterceptor.prototype.intercept = function (context, next) {
        var _this = this;
        var startTime = Date.now();
        var http = context.switchToHttp();
        var req = http.getRequest();
        var res = http.getResponse();
        return next.handle().pipe((0, operators_1.tap)(function () {
            var duration = Date.now() - startTime;
            var statusCodeColor = _this.getStatusCodeColor(res.statusCode);
            (0, log_1["default"])("\u001B[34m".concat(req.method, "\u001B[0m ").concat(req.url, " ").concat(statusCodeColor || "-", " ").concat(res.getHeader("content-length") || "-", " ").concat(duration, "ms"));
        }), (0, operators_1.catchError)(function (error) {
            var _a;
            console.error(error);
            var duration = Date.now() - startTime;
            var statusCode = error.status || error.statusCode || common_1.HttpStatus.INTERNAL_SERVER_ERROR;
            var statusCodeColor = _this.getStatusCodeColor(statusCode);
            var message = error.message || error;
            if ((_a = error.response) === null || _a === void 0 ? void 0 : _a.message) {
                if (typeof error.response.message === "string")
                    message = error.response.message;
                else
                    message = error.response.message.join(", ");
            }
            (0, log_1["default"])("\u001B[34m".concat(req.method, "\u001B[0m ").concat(req.url, " ").concat(statusCodeColor || "-", " ").concat(res.getHeader("content-length") || "-", " ").concat(duration, "ms \u001B[33m").concat(message, "\u001B[0m"));
            return (0, rxjs_1.throwError)(function () { return new common_1.HttpException(message, statusCode); });
        }));
    };
    NestHTTPInterceptor.prototype.getStatusCodeColor = function (statusCode) {
        if (statusCode >= 200 && statusCode < 300) {
            return "\u001B[32m".concat(statusCode, "\u001B[0m"); // Green for 2xx
        }
        else if (statusCode >= 300 && statusCode < 400) {
            return "\u001B[34m".concat(statusCode, "\u001B[0m"); // Blue for 3xx
        }
        else if (statusCode >= 400 && statusCode < 500) {
            return "\u001B[33m".concat(statusCode, "\u001B[0m"); // Yellow for 4xx
        }
        else if (statusCode >= 500) {
            return "\u001B[31m".concat(statusCode, "\u001B[0m"); // Red for 5xx
        }
        else {
            return "".concat(statusCode); // Default no color
        }
    };
    return NestHTTPInterceptor;
}());
exports.NestHTTPInterceptor = NestHTTPInterceptor;
