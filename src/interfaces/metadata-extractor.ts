import { CronOptions } from "./cron-options";
import { EventHookWithCallback } from "./event-hook-metadata";
import { ScheduleCallback } from "./schedule-options";

export type ExtractedMetadata = {
  className: string;
  methodName: string;
  options: CronOptions;
  expression: string;
  queueName: string;
  hooks: EventHookWithCallback[];
  callback: ScheduleCallback;
};
