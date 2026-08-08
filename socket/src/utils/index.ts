export * from './serverCommon';
export* from './users';
import moment, { Moment } from "moment";

export function formatMessage(username: string, text: string) {
  return {
    username,
    text,
    time: moment().format('h:mm a')
  };
}

export const botName = "Hiskool Award";


export function calculateTimeDiff(from: Moment, to: Moment): string {
  const timeDiff = from.diff(to, "milliseconds");

  if (timeDiff === 0) {
    return "now";
  } else if (timeDiff > 0) {
    if (from.isSame(to, "day")) {
      return `about ${moment.duration(timeDiff).humanize()} ago`;
    } else if (from.subtract(1, "days").isSame(to, "day")) {
      return "yesterday";
    } else {
      return to.local().format("YYYY-MM-DD HH:mm:ss");
    }
  } else {
    if (from.add(1, "days").isSame(to, "day")) {
      return "tomorrow";
    } else {
      return `in ${moment.duration(-timeDiff).humanize()}`;
    }
  }
}

export function asyncWrap(fn: (globalData: any) => Promise<any>, globalData: any) {
  return (async () => {
    await fn(globalData);
  })();
}

export function cleanRepetitiveFileName(inputString: string): string {
  const pattern = /-?\d+(?:\s*\([^)]*\))?$/ // Matches (digit) pattern at the end and captures the digit.
  const replacement = ''; // Replace with an empty string.

  const modifiedString = inputString.replace(pattern, replacement);
  return modifiedString;
}