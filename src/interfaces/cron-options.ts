export interface CronOptions {
  /**
   * The name of the job to add this job to.
   * If `name` is not set, the job will be added to the default queue using name of the class as the queue name and the job name.
   */
  name?: string;

  /**
   * The time zone to use for the cron expression.
   * If `timeZone` is not set, the cron expression will be evaluated in the local time zone.
   */
  timezone?: string;
}
