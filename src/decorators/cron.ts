import { CRON_EXPRESSION, CRON_OPTIONS } from "@/constants/metadata";
import { CronOptions } from "@/interfaces/cron-options";
import { SetMetadata, applyDecorators } from "@nestjs/common";

/**
 * Decorator allowing creates a scheduled job.
 * @param expression string or enum `CronExpression`
 * @param options CronOptions
 */
export function Cron(expression: string): MethodDecorator;
export function Cron(expression: string, options: CronOptions): MethodDecorator;
export function Cron(
  expression: string,
  options?: CronOptions,
): MethodDecorator {
  const { ...opts } = options || {};

  return applyDecorators(
    SetMetadata(CRON_EXPRESSION, expression),
    SetMetadata(CRON_OPTIONS, opts),
  );
}
