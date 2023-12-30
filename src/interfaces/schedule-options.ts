import { Job } from "bullmq";

export type ScheduleOptions = {
  queueName: string;
  name: string;
  timeZone?: string;
};

export type ScheduleCallback = <T>(job: Job<T>) => void;
