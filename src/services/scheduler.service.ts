import { CRON_MODULE_REDIS_OPTIONS } from "@/constants/metadata";
import { ScheduleCallback, ScheduleOptions } from "@/interfaces/schedule-options";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConnectionOptions, Job, Queue, Worker } from "bullmq";

@Injectable()
export class ScheduleService {
  private logger = new Logger(ScheduleService.name);

  public constructor(
    @Inject(CRON_MODULE_REDIS_OPTIONS) private redisOptions: ConnectionOptions,
  ) {}

  /**
   * Schedule a job.
   * @param expression string or enum `CronExpression`
   * @param options ScheduleOptions
   */
  public async schedule(expression: string, options: ScheduleOptions): Promise<void> {
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
        ...(options.timeZone && { tz: options.timeZone }),
      },
      removeOnComplete: true,
    });

    this.logger.log(`Job scheduled: ${options.queueName}.${options.name}`);
  }

  /**
   * Process a job from a queue
   * @param callback ScheduleCallback
   * @param queueName string
   */
  public async process(queueName: string, callback: ScheduleCallback): Promise<void> {
    const options = {
      connection: this.redisOptions,
      removeOnComplete: {
        count: 1,
      },
    };

    const workerProcess = async (job: Job): Promise<void> => callback(job);

    new Worker(queueName, workerProcess, options);
  }
}
