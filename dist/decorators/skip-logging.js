"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkipLogging = void 0;
const common_1 = require("@nestjs/common");
const SkipLogging = () => (0, common_1.SetMetadata)("skip-request-interceptor", true);
exports.SkipLogging = SkipLogging;
//# sourceMappingURL=skip-logging.js.map