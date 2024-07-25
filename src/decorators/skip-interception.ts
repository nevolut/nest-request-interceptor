import { SetMetadata } from "@nestjs/common";

export const SkipInterceptor = () => SetMetadata("skip-request-interceptor", true);
