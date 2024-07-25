import { SetMetadata } from "@nestjs/common";

export const SkipLogging = () => SetMetadata("skip-request-interceptor", true);
