/**
 * Parses the queue name by converting camel case to kebab case.
 *
 * @param queueName - The queue name to be parsed.
 * @returns The parsed queue name in kebab case.
 */
export const parseQueueName = (queueName: string): string => {
  return queueName.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
};
