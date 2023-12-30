import { EventHookWithCallback } from "@/interfaces/event-hook-metadata";
import { ExtractedMetadata } from "@/interfaces/metadata-extractor";
import { parseQueueName } from "@/utils/parse-queue-name";
import { Injectable } from "@nestjs/common";
import { MetadataScanner } from "@nestjs/core";
import { InstanceWrapper } from "@nestjs/core/injector/instance-wrapper";
import { MetadataAccessor } from "./metadata-accessor.service";

@Injectable()
export class MetadataExtractor {
  public constructor(
    private metadataAccessor: MetadataAccessor,
    private metadataScanner: MetadataScanner,
  ) {}

  public extract(instanceWrapper: InstanceWrapper): ExtractedMetadata[] {
    const { instance } = instanceWrapper;

    if (!instance || !Object.getPrototypeOf(instance)) return [];

    const prototype = Object.getPrototypeOf(instance);

    const methodNames = this.metadataScanner.getAllMethodNames(prototype);

    const extractedMetadata: ExtractedMetadata[] = [];
    const eventHookMetadata: EventHookWithCallback[] = [];

    methodNames.forEach(methodName => {
      const callback = instance[methodName];

      const expression = this.metadataAccessor.getExpression(callback);
      const options = this.metadataAccessor.getOptions(callback) || {};
      const eventHook = this.metadataAccessor.getEventHook(callback);

      if (eventHook) {
        eventHookMetadata.push({
          event: eventHook.event,
          callback: callback.bind(instance),
        });
      }

      if (!expression) return;

      extractedMetadata.push({
        expression,
        options,
        methodName,
        className: instanceWrapper.name,
        queueName: parseQueueName(options.queueName || instanceWrapper.name),
        hooks: eventHookMetadata,
        callback: callback.bind(instance),
      });
    });

    return extractedMetadata;
  }

  public extractAll(instanceWrappers: InstanceWrapper[]): ExtractedMetadata[] {
    return instanceWrappers.reduce((acc, instanceWrapper) => {
      return [...acc, ...this.extract(instanceWrapper)];
    }, [] as ExtractedMetadata[]);
  }
}
