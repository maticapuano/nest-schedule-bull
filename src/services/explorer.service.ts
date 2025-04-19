import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { DiscoveryService } from "@nestjs/core";
import { InstanceWrapper } from "@nestjs/core/injector/instance-wrapper";
import { MetadataExtractor } from "./metadata-extractor.service";
import { ScheduleService } from "./scheduler.service";

@Injectable()
export class ScheduleExplorer implements OnModuleInit {
  private logger = new Logger(ScheduleExplorer.name);

  public constructor(
    private discoveryService: DiscoveryService,
    private scheduleService: ScheduleService,
    private metadataExtractor: MetadataExtractor,
  ) {}

  public async onModuleInit(): Promise<void> {
    this.logger.log("ScheduleExplorer initialized");

    await this.explore();
  }

  private async explore(): Promise<void> {
    this.logger.log("ScheduleExplorer exploring");

    const instanceWrappers: InstanceWrapper[] = [
      ...this.discoveryService.getControllers(),
      ...this.discoveryService.getProviders(),
    ];

    const metadataExtracted = this.metadataExtractor.extractAll(instanceWrappers);

    if (!metadataExtracted.length) this.logger.log("No schedule found");

    for (const metadata of metadataExtracted) {
      try {
        await this.scheduleService.schedule(metadata.expression, {
          name: metadata.methodName,
          queueName: metadata.queueName,
        });

        await this.scheduleService.process(metadata);

        this.logger.debug(
          `Scheduled and processed job: ${metadata.queueName}.${metadata.methodName}`,
        );
      } catch (error) {
        this.logger.error(
          `Failed to schedule/process job ${metadata.queueName}.${metadata.methodName}: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
      }
    }
  }
}
