"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkipNoise = void 0;
const common_1 = require("@nestjs/common");
/**
 * Decorator to suppress repetitive log entries for a route.
 *
 * The first request is always logged. Subsequent identical requests
 * (same pattern + status) are suppressed until the response changes.
 *
 * Useful for health checks, readiness probes, and other high-frequency
 * endpoints that produce identical responses.
 *
 * @example
 * ```typescript
 * @SkipNoise()
 * @Get("health-check")
 * healthCheck() {
 *   return { status: "ok" };
 * }
 * ```
 */
const SkipNoise = () => (0, common_1.SetMetadata)("skip-noise-interceptor", true);
exports.SkipNoise = SkipNoise;
//# sourceMappingURL=skip-noise.js.map