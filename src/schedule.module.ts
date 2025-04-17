import { DynamicModule, Module } from "@nestjs/common";
import { DiscoveryModule } from "@nestjs/core";
import { ConnectionOptions } from "bullmq";
import { CRON_MODULE_REDIS_OPTIONS } from "./constants/metadata";
import { ScheduleExplorer } from "./services/explorer.service";
import { MetadataAccessor } from "./services/metadata-accessor.service";
import { MetadataExtractor } from "./services/metadata-extractor.service";
import { ScheduleService } from "./services/scheduler.service";

export interface ScheduleBullModuleOptions {
  queueName?: string;
  connection?: ConnectionOptions;
}

@Module({
  imports: [DiscoveryModule],
  providers: [MetadataAccessor, ScheduleService, MetadataExtractor],
})
export class ScheduleBullModule {
  public static forRoot(options: ScheduleBullModuleOptions): DynamicModule {
    return {
      global: true,
      module: ScheduleBullModule,
      providers: [
        ScheduleExplorer,
        {
          provide: CRON_MODULE_REDIS_OPTIONS,
          useValue: options ?? {},
        },
      ],
      exports: [],
    };
  }
}
