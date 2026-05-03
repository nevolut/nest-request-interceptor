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
var RPCInterceptor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RPCInterceptor = void 0;
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const operators_1 = require("rxjs/operators");
let RPCInterceptor = RPCInterceptor_1 = class RPCInterceptor {
    reflector;
    logger = new common_1.Logger(RPCInterceptor_1.name);
    noiseCache = new Map();
    constructor(reflector) {
        this.reflector = reflector;
    }
    intercept(context, next) {
        const startTime = Date.now();
        const skip = this.reflector
            ? this.reflector.getAllAndOverride("skip-request-interceptor", [
                context.getHandler(),
                context.getClass()
            ])
            : false;
        const skipNoise = this.reflector
            ? this.reflector.getAllAndOverride("skip-noise-interceptor", [
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
            this.logger.error(`Error parsing message content: ${error.message}`);
            return next.handle();
        }
        if (!skip && !skipNoise)
            this.logger.log(`\x1b[34m${id ? "REQUEST" : "RECEIVED"}\x1b[0m ${id || "-"} ${pattern}`);
        return next.handle().pipe((0, operators_1.tap)(() => {
            if (skip)
                return;
            const duration = Date.now() - startTime;
            const tag = id ? "SEND" : "EMIT";
            const logLine = `\x1b[32m${tag}\x1b[0m ${id || "-"} ${pattern} ${duration}ms`;
            if (skipNoise && pattern) {
                const sig = `${pattern}:ok`;
                if (this.noiseCache.get(pattern) === sig)
                    return;
                this.noiseCache.set(pattern, sig);
            }
            this.logger.log(logLine);
        }), (0, operators_1.catchError)(error => {
            if (!error.status || error.status >= 500)
                console.error(error);
            const duration = Date.now() - startTime;
            let message = error.message || error;
            if (error.response?.message) {
                if (typeof error.response.message === "string")
                    message = error.response.message;
                else
                    message = error.response.message.join(", ");
            }
            if (!skip) {
                this.logger.error(`\x1b[31m${id ? "SEND" : "EMIT"}\x1b[0m ${id || "-"} ${pattern} ${duration}ms - \x1b[33m${message}\x1b[0m`);
            }
            // Reset noise cache on error so next success logs
            if (skipNoise && pattern)
                this.noiseCache.delete(pattern);
            throw new microservices_1.RpcException(message);
        }));
    }
};
exports.RPCInterceptor = RPCInterceptor;
exports.RPCInterceptor = RPCInterceptor = RPCInterceptor_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Optional)()),
    __param(0, (0, common_1.Inject)(core_1.Reflector)),
    __metadata("design:paramtypes", [core_1.Reflector])
], RPCInterceptor);
//# sourceMappingURL=rpc.interceptor.js.map