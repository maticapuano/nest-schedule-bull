import {
  CRON_EXPRESSION,
  CRON_MODULE_ON_QUEUE_HOOK,
  CRON_OPTIONS,
} from "@/constants/metadata";
import { CronOptions } from "@/interfaces/cron-options";
import { EventHookMetadata } from "@/interfaces/event-hook-metadata";
import { Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class MetadataAccessor {
  public constructor(private reflector: Reflector) {}

  public getExpression(target: Function): string | undefined {
    return this.reflector.get(CRON_EXPRESSION, target);
  }

  public getOptions(target: Function): CronOptions | undefined {
    return this.reflector.get(CRON_OPTIONS, target);
  }

  public getEventHook(target: Function): EventHookMetadata | undefined {
    return this.reflector.get(CRON_MODULE_ON_QUEUE_HOOK, target);
  }
}
