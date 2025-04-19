import { CRON_MODULE_REDIS_OPTIONS } from "@/constants/metadata";
import { ExtractedMetadata } from "@/interfaces/metadata-extractor";
import { ScheduleBullModuleOptions } from "@/interfaces/module-options";
import { ScheduleOptions } from "@/interfaces/schedule-options";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConnectionOptions, Job, Queue, Worker, WorkerOptions } from "bullmq";

@Injectable()
export class ScheduleService {
  private logger = new Logger(ScheduleService.name);

  public constructor(
    @Inject(CRON_MODULE_REDIS_OPTIONS) private redisOptions: ScheduleBullModuleOptions,
  ) {}

  public async schedule(expression: string, options: ScheduleOptions): Promise<void> {
    const queueName = this.redisOptions.connection
      ? `${this.redisOptions.queueName}-${options.queueName}`
      : options.queueName;

    const queue = new Queue(queueName, {
      connection: this.redisOptions.connection as ConnectionOptions,
      defaultJobOptions: {},
    });

    const repeatableJobs = await queue.getJobSchedulers();

    await Promise.all(repeatableJobs.map(job => queue.removeJobScheduler(job.key)));

    await queue.add(options.name, undefined, {
      repeat: {
        pattern: expression,
        ...(options.timezone && { tz: options.timezone }),
      },
      removeOnComplete: true,
    });

    this.logger.log(`Job scheduled: ${options.queueName}.${options.name}`);
  }

  public async process(metadata: ExtractedMetadata): Promise<void> {
    const { queueName, hooks, callback } = metadata;

    const options: WorkerOptions = {
      connection: this.redisOptions.connection as ConnectionOptions,
      removeOnComplete: {
        count: 1,
      },
    };

    const workerProcess = async (job: Job): Promise<void> => callback(job);

    const worker = new Worker(queueName, workerProcess, options);

    for (const { event, callback } of hooks) {
      worker.on(event, async (job: Job, ...args: unknown[]) => {
        try {
          await callback(job, ...args);
        } catch (error) {
          this.logger.error(
            `Error in ${event} hook for job ${job.id}: ${error instanceof Error ? error.message : String(error)}`,
          );
        }
      });
    }
  }
}
