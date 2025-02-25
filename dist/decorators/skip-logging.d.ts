/**
 * Decorator to conditionally skip logging for a specific route, method, or controller.
 *
 * By default, it disables logging (`skip = true`). If explicitly set to `false`, logging will remain active.
 *
 * @param {boolean} [skip=true] - Determines whether to skip logging (`true` to disable logging, `false` to keep logging active).
 *
 * @example
 * ```typescript
 * import { Controller, Get } from "@nestjs/common";
 * import { SkipLogging } from "./decorators/skip-logging";
 *
 * @Controller("users")
 * export class UserController {
 *
 *   // Logging is skipped for this method
 *   @Get("hidden")
 *   @SkipLogging()
 *   hiddenRoute() {
 *     return { message: "This request will not be logged" };
 *   }
 *
 *   // Logging remains active for this method
 *   @Get("public")
 *   @SkipLogging(false)
 *   publicRoute() {
 *     return { message: "This request will be logged" };
 *   }
 * }
 * ```
 */
export declare const SkipLogging: (skip?: boolean) => import("@nestjs/common").CustomDecorator<string>;
