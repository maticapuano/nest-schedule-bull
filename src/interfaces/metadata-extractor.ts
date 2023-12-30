import { CronOptions } from "./cron-options";
import { ScheduleCallback } from "./schedule-options";

export type ExtractedMetadata = {
  className: string;
  methodName: string;
  options: CronOptions;
  expression: string;
  queueName: string;
  callback: ScheduleCallback;
};
