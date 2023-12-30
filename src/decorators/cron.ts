import { CRON_EXPRESSION, CRON_OPTIONS } from "@/constants/metadata";
import { CronExpression } from "@/interfaces/cron-expression";
import { CronOptions } from "@/interfaces/cron-options";
import { SetMetadata, applyDecorators } from "@nestjs/common";

/**
 * Decorator allowing creates a scheduled job.
 * @param expression string or enum `CronExpression`
 * @param options CronOptions
 */
export function Cron(expression: CronExpression): MethodDecorator;
export function Cron(
  expression: CronExpression,
  options: CronOptions,
): MethodDecorator;
export function Cron(
  expression: CronExpression,
  options?: CronOptions,
): MethodDecorator {
  const { ...opts } = options || {};

  return applyDecorators(
    SetMetadata(CRON_EXPRESSION, expression),
    SetMetadata(CRON_OPTIONS, opts),
  );
}
