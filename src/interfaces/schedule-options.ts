import { Job } from "bullmq";

export type ScheduleOptions = {
  queueName: string;
  name: string;
  timezone?: string;
};

export type ScheduleCallback = <T>(job: Job<T>, ...args: unknown[]) => void;
