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
exports.RPCInterceptor = void 0;
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const operators_1 = require("rxjs/operators");
const log_1 = require("../utils/log");
let RPCInterceptor = class RPCInterceptor {
    /**
     * Constructor for RPCInterceptor.
     *
     * @param {Reflector} [reflector] - Optional NestJS Reflector for handling metadata.
     */
    constructor(reflector) {
        this.reflector = reflector;
    }
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
    intercept(context, next) {
        const startTime = Date.now();
        // Check if logging is skipped for this request
        const skip = this.reflector
            ? this.reflector.getAllAndOverride("skip-request-interceptor", [
                context.getHandler(),
                context.getClass()
            ])
            : false;
        const rpc = context.switchToRpc();
        const ctx = rpc.getContext();
        const msg = ctx.getMessage();
        let id;
        let pattern;
        try {
            const data = JSON.parse(msg.content.toString());
            id = data.id;
            pattern = data.pattern;
        }
        catch (error) {
            (0, log_1.default)(`Error parsing message content: ${error.message}`);
            return next.handle();
        }
        if (!skip)
            (0, log_1.default)(`\x1b[34m${id ? "REQUEST" : "RECEIVED"}\x1b[0m ${id || "-"} ${pattern}`);
        return next.handle().pipe((0, operators_1.tap)(() => {
            const duration = Date.now() - startTime;
            if (!skip)
                (0, log_1.default)(`\x1b[32m${id ? "SEND" : "EMIT"}\x1b[0m ${id || "-"} ${pattern} ${duration}ms`);
        }), (0, operators_1.catchError)(error => {
            var _a;
            if (!error.status || error.status >= 500)
                console.error(error);
            const duration = Date.now() - startTime;
            let message = error.message || error;
            if ((_a = error.response) === null || _a === void 0 ? void 0 : _a.message) {
                if (typeof error.response.message === "string")
                    message = error.response.message;
                else
                    message = error.response.message.join(", ");
            }
            (0, log_1.default)(`\x1b[31m${id ? "SEND" : "EMIT"}\x1b[0m ${id || "-"} ${pattern} ${duration}ms - \x1b[33m${message}\x1b[0m`);
            throw new microservices_1.RpcException(message);
        }));
    }
};
exports.RPCInterceptor = RPCInterceptor;
exports.RPCInterceptor = RPCInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Optional)()),
    __param(0, (0, common_1.Inject)(core_1.Reflector)),
    __metadata("design:paramtypes", [core_1.Reflector])
], RPCInterceptor);
//# sourceMappingURL=rpc.interceptor.js.map