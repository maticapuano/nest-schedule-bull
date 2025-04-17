import { ConnectionOptions } from "bullmq";

export interface ScheduleBullModuleOptions {
  queueName?: string;
  connection?: ConnectionOptions;
}

export interface ScheduleBullModuleAsyncOptions {
  useFactory: (
    ...args: any[]
  ) => Promise<ScheduleBullModuleOptions> | ScheduleBullModuleOptions;
  inject?: any[];
  imports?: any[];
}
