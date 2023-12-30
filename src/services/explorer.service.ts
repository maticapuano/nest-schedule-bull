import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { DiscoveryService, MetadataScanner } from "@nestjs/core";
import { InstanceWrapper } from "@nestjs/core/injector/instance-wrapper";
import { MetadataAccessor } from "./metadata-accessor.service";
import { ScheduleService } from "./scheduler.service";

@Injectable()
export class ScheduleExplorer implements OnModuleInit {
  private logger = new Logger(ScheduleExplorer.name);

  public constructor(
    private metadataAccessor: MetadataAccessor,
    private metadataScanner: MetadataScanner,
    private discoveryService: DiscoveryService,
    private scheduleService: ScheduleService,
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

    instanceWrappers.forEach((wrapper: InstanceWrapper) => {
      const { instance } = wrapper;

      if (!instance || !Object.getPrototypeOf(instance)) return;

      const prototype = Object.getPrototypeOf(instance);

      const methodNames = this.metadataScanner.getAllMethodNames(prototype);

      methodNames.forEach((methodName: string) => {
        const callback = instance[methodName];

        const expression = this.metadataAccessor.getExpression(callback);
        const options = this.metadataAccessor.getOptions(callback);

        if (!expression) return;

        this.logger.log(
          `Scheduling for ${prototype.constructor.name}.${methodName}`,
        );

        const queueName = options?.queueName ?? prototype.constructor.name;

        this.scheduleService.addSchedule(expression, callback.bind(instance), {
          name: methodName,
          queueName,
        });
      });
    });
  }
}
