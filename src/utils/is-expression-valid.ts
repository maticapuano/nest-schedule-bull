import { parseExpression } from "cron-parser";

export const isExpressionValid = (expression: string): boolean => {
  try {
    parseExpression(expression);
    return true;
  } catch (error) {
    return false;
  }
};
