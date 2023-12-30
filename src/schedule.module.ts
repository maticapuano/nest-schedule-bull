import { DynamicModule, Module } from "@nestjs/common";
import { ConnectionOptions } from "bullmq";
import { CRON_MODULE_REDIS_OPTIONS } from "./constants/metadata";

@Module({})
export class ScheduleBullModule {
  public static forRoot(options: ConnectionOptions): DynamicModule {
    return {
      global: true,
      module: ScheduleBullModule,
      providers: [
        {
          provide: CRON_MODULE_REDIS_OPTIONS,
          useValue: options ?? {},
        },
      ],
      exports: [],
    };
  }
}
