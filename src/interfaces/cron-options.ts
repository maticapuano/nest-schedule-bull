export interface CronOptions {
  /**
   * The name of the queue to add this job to.
   * If `queueName` is not set, the job will be added to the default queue using name of the class as the queue name and the job name.
   */
  queueName?: string;
}
