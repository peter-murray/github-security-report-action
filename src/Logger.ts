import { info } from '@actions/core';

export enum LogLevel {
  DEBUG,
  INFO,
  WARN,
  ERROR
}


export class Logger {

  private readonly logLevel: LogLevel;

  constructor(level: LogLevel) {
    this.logLevel = level
  }

  debug(message: string) {
    this.logMessage(LogLevel.DEBUG, message);
  }

  info(message: string) {
    this.logMessage(LogLevel.INFO, message);
  }

  warn(message: string) {
    this.logMessage(LogLevel.WARN, message);
  }

  error(message: string) {
    this.logMessage(LogLevel.ERROR, message);
  }

  private logMessage(level: LogLevel, message: string) {
    if (this.logLevel >= level) {
      info(`[${LogLevel[level]}] ${message}`);
    }
  }
}