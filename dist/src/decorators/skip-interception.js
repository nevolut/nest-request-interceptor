"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkipInterceptor = void 0;
const common_1 = require("@nestjs/common");
const SkipInterceptor = () => (0, common_1.SetMetadata)("skip-request-interceptor", true);
exports.SkipInterceptor = SkipInterceptor;
//# sourceMappingURL=skip-interception.js.map