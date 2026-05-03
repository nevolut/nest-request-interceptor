import { SetMetadata } from "@nestjs/common";

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
export const SkipNoise = () => SetMetadata("skip-noise-interceptor", true);
