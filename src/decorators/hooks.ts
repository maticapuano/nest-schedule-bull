import { CRON_MODULE_ON_QUEUE_HOOK } from "@/constants/metadata";
import { EventHookMetadata } from "@/interfaces/event-hook-metadata";
import { SetMetadata } from "@nestjs/common";
import { WorkerListener } from "bullmq";

const EventQueueHookFactory = (event: keyof WorkerListener): MethodDecorator => {
  const metadata: EventHookMetadata = { event };

  return SetMetadata(CRON_MODULE_ON_QUEUE_HOOK, metadata);
};

/**
 * Decorator that dispatches the decorated method when a job becomes active.
 * @returns {MethodDecorator} - Decorator function to handle the "active" event on the specified queue.
 */
export const OnQueueActive = (): MethodDecorator => {
  return EventQueueHookFactory("active");
};

/**
 * Decorator that dispatches the decorated method when a job is completed.
 * @returns {MethodDecorator} - Decorator function to handle the "completed" event on the specified queue.
 */
export const OnQueueCompleted = (): MethodDecorator => {
  return EventQueueHookFactory("completed");
};

/**
 * Decorator that dispatches the decorated method when a job encounters an error.
 * @returns {MethodDecorator} - Decorator function to handle the "error" event on the specified queue.
 */
export const OnQueueError = (): MethodDecorator => {
  return EventQueueHookFactory("error");
};

/**
 * Decorator that dispatches the decorated method when a job fails.
 * @returns {MethodDecorator} - Decorator function to handle the "failed" event on the specified queue.
 */
export const OnQueueFailed = (): MethodDecorator => {
  return EventQueueHookFactory("failed");
};

/**
 * Decorator that dispatches the decorated method when a job makes progress.
 * @returns {MethodDecorator} - Decorator function to handle the "progress" event on the specified queue.
 */
export const OnQueueProgress = (): MethodDecorator => {
  return EventQueueHookFactory("progress");
};
