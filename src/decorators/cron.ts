import { CRON_EXPRESSION, CRON_OPTIONS } from "@/constants/metadata";
import { InvalidExpression } from "@/exceptions/invalid-expression";
import { InvalidTimeZone } from "@/exceptions/invalid-time-zone";
import { CronOptions } from "@/interfaces/cron-options";
import { isExpressionValid } from "@/utils/is-expression-valid";
import { isValidTimezone } from "@/utils/is-timezone-valid";
import { SetMetadata, applyDecorators } from "@nestjs/common";

/**
 * Decorator for creating a scheduled job with a cron expression and optional options.
 * @param {string} expression - A cron expression or an enum `CronExpression` representing the job schedule.
 * @param {CronOptions} [options] - Optional configuration options for the scheduled job.
 * @returns {MethodDecorator} - Decorator function to set metadata for the cron expression and options.
 */
export function Cron(expression: string): MethodDecorator;
export function Cron(expression: string, options: CronOptions): MethodDecorator;
export function Cron(expression: string, options?: CronOptions): MethodDecorator {
  const { ...opts } = options || {};

  if (!isExpressionValid(expression)) {
    throw new InvalidExpression(expression);
  }

  if (options && options.timezone && !isValidTimezone(options.timezone)) {
    throw new InvalidTimeZone(options.timezone);
  }

  return applyDecorators(
    SetMetadata(CRON_EXPRESSION, expression),
    SetMetadata(CRON_OPTIONS, opts),
  );
}
