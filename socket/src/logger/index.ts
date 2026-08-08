export * from "./childLogger"
import * as cdmlogger from 'cdm-logger';
import * as Logger from 'bunyan';
export const logger = cdmlogger.ConsoleLogger.create("test", { level: "trace" }) as Logger;
