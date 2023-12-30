export class InvalidTimeZone extends Error {
  public constructor(timeZone: string) {
    super(`Invalid time zone: ${timeZone}`);
  }
}
