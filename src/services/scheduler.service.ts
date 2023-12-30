import { CRON_MODULE_REDIS_OPTIONS } from "@/constants/metadata";
import {
  ScheduleCallback,
  ScheduleOptions,
} from "@/interfaces/schedule-options";
import { Inject, Injectable } from "@nestjs/common";
import { ConnectionOptions, Job, Queue, Worker } from "bullmq";

@Injectable()
export class ScheduleService {
  public constructor(
    @Inject(CRON_MODULE_REDIS_OPTIONS) private redisOptions: ConnectionOptions,
  ) {}

  public async addSchedule(
    expression: string,
    callback: ScheduleCallback,
    options: ScheduleOptions,
  ): Promise<void> {
    const queue = new Queue(options.queueName, {
      connection: this.redisOptions,
      defaultJobOptions: {},
    });

    const repeatableJobs = await queue.getRepeatableJobs();

    for (const repeatableJob of repeatableJobs) {
      await queue.removeRepeatableByKey(repeatableJob.key);
    }

    await queue.add(options.name, undefined, {
      repeat: {
        pattern: expression,
      },
      removeOnComplete: true,
    });

    new Worker(options.queueName, async (job: Job) => callback(job), {
      connection: this.redisOptions,
      removeOnComplete: {
        count: 1,
      },
    });
  }
}
