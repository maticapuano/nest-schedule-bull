# Nest schedule bull

A NestJS module for scheduling Bull jobs using cron expressions

## Installation

```bash
npm install nest-schedule-bull
```

## Motivation

Modern applications often require reliable and efficient job scheduling to automate repetitive tasks, manage background processes, and enhance overall system performance. Nest Schedule Bull is motivated by the need for a flexible and scalable solution that seamlessly integrates with NestJS and leverages the robust capabilities of the Bull job queue.

Benefits over [`@nestjs/schedule`](https://www.npmjs.com/package/@nestjs/schedule)

- **Distributed Job Processing**:
  Nest Schedule Bull, built on top of Bull, supports distributed job processing. This is particularly beneficial in scenarios where tasks need to be executed across multiple nodes or instances.
- **Enhanced Scalability**:
  Nest Schedule Bull Leveraging the scalability of Bull, Nest Schedule Bull allows you to scale your job processing horizontally, ensuring optimal performance as your application grows.
- **Robust Job Monitoring**: With the integration of Bull's features, Nest Schedule Bull provides extensive job monitoring capabilities. This includes real-time tracking of job status, progress, and error handling, empowering you with in-depth insights into your scheduled tasks.
- **Cron Expression Flexibility**: Nest Schedule Bull offers a wide range of cron expression options, allowing you to schedule jobs with precision and flexibility. This is essential for executing tasks at specific intervals or implementing complex scheduling patterns.

## Usage

First you need to import the module in your `app.module.ts` file:

```typescript
import { Module } from "@nestjs/common";
import { ScheduleBullModule } from "nest-schedule-bull";

@Module({
  imports: [
    ScheduleBullModule.forRoot({
      connection: {
        url: "redis://localhost:6379",
      },
      queueName: "crons", // Optional
    }),
  ],
})
export class AppModule {}
```

Then you can use the `@Cron()` decorator to schedule your jobs:

```typescript
import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "nest-schedule-bull";

@Injectable()
export class AppService {
  private logger = new Logger(AppService.name);

  @Cron(CronExpression.EVERY_10_SECONDS)
  public async doSomething(): Promise<void> {
    this.logger.log("Doing something...");
  }
}
```

If you need check the status of your jobs, you can use the following decorators:

```typescript
import { Injectable, Logger } from "@nestjs/common";
import {
  Cron,
  CronExpression,
  OnQueueActive,
  OnQueueCompleted,
  OnQueueError,
  OnQueueFailed,
  OnQueueProgress,
} from "nest-schedule-bull";

@Injectable()
export class AppService {
  private logger = new Logger(AppService.name);

  @Cron(CronExpression.EVERY_10_SECONDS)
  public async doSomething(): Promise<void> {
    this.logger.log("Doing something...");
  }

  @OnQueueActive()
  public onActive(job: Job): void {
    this.logger.log(`Job ${job.id} is active`);
  }

  @OnQueueCompleted()
  public onCompleted(job: Job): void {
    this.logger.log(`Job ${job.id} is completed`);
  }

  @OnQueueError()
  public onError(job: Job, error: Error): void {
    this.logger.log(`Job ${job.id} has failed with error ${error.message}`);
  }

  @OnQueueFailed()
  public onFailed(job: Job, error: Error): void {
    this.logger.log(`Job ${job.id} has failed with error ${error.message}`);
  }

  @OnQueueProgress()
  public onProgress(job: Job): void {
    this.logger.log(`Job ${job.id} is ${job.progress}% done`);
  }
}
```

## Stay in touch

- Author - [Matias Capuano](https://github.com/maticapuano)
- LinkedIn - [Matias Capuano](https://www.linkedin.com/in/matias-capuano/)

## License

`nest-schedule-bull` is [MIT licensed](LICENSE).
