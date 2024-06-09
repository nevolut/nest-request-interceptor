"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RPCInterceptor = exports.HTTPInterceptor = void 0;
const http_interceptor_1 = require("./src/interceptors/http.interceptor");
Object.defineProperty(exports, "HTTPInterceptor", { enumerable: true, get: function () { return http_interceptor_1.HTTPInterceptor; } });
const rpc_interceptor_1 = require("./src/interceptors/rpc.interceptor");
Object.defineProperty(exports, "RPCInterceptor", { enumerable: true, get: function () { return rpc_interceptor_1.RPCInterceptor; } });
//# sourceMappingURL=main.js.map