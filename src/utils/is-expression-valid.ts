import { CronExpressionParser } from "cron-parser";

export const isExpressionValid = (expression: string): boolean => {
  try {
    CronExpressionParser.parse(expression);
    return true;
  } catch (error) {
    return false;
  }
};
