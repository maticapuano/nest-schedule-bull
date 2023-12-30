import { WorkerListener } from "bullmq";
import { ScheduleCallback } from "./schedule-options";

export type EventHookMetadata = {
  event: keyof WorkerListener;
};

export type EventHookWithCallback = EventHookMetadata & {
  callback: ScheduleCallback;
};
