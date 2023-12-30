import { WorkerListener } from "bullmq";

export type EventHookMetadata = {
  event: keyof WorkerListener;
  queueName?: string;
};
