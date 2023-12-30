export class InvalidExpression extends Error {
  public constructor(expression: string) {
    super(`Invalid expression: ${expression}`);
  }
}
