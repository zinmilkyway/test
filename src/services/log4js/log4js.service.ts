import { Injectable } from '@nestjs/common';
import { configure, getLogger, Logger as FourLogger } from 'log4js';
import { Logger, QueryRunner } from 'typeorm';

/* eslint-disable @typescript-eslint/no-empty-function */
class DbLogger implements Logger {
  constructor(private logger: FourLogger) {}
  /**
   * Logs query and parameters used in it.
   */
  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): any {
    this.logger.debug(
      `query=${query}` +
        (parameters ? ` parameters: ${JSON.stringify(parameters)}` : ``)
    );
  }
  /**
   * Logs query that is failed.
   */
  logQueryError(
    error: string,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner
  ): any {
    this.logger.error(
      `query=${query} parameters: ${JSON.stringify(parameters)}`
    );
  }
  /**
   * Logs query that is slow.
   */
  logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner
  ): any {
    this.logger.warn(
      `time=${time} query=${query} parameters: ${JSON.stringify(parameters)}`
    );
  }
  /**
   * Logs events from the schema build process.
   */
  logSchemaBuild(message: string, queryRunner?: QueryRunner): any {}
  /**
   * Logs events from the migrations run process.
   */
  logMigration(message: string, queryRunner?: QueryRunner): any {}
  /**
   * Perform logging using given logger, or by default to the console.
   * Log has its own level and message.
   */
  log(
    level: 'log' | 'info' | 'warn',
    message: any,
    queryRunner?: QueryRunner
  ): any {
    this.logger[level](message);
  }
}

@Injectable()
export class LogServices {
  constructor() {
    configure({
      appenders: {
        everything: {
          type: 'dateFile',
          filename: 'logs/log.log',
          pattern: 'yyyy-MM-dd-hh',
          compress: false
        }
      },
      categories: {
        default: { appenders: ['everything'], level: 'debug' }
      }
    });
  }
  getLogger = getLogger;
  debugLogger(category: string) {
    const logger = this.getLogger(category);
    return {
      info: logger.info.bind(logger),
      debug: logger.debug.bind(logger),
      warn: logger.warn.bind(logger),
      error: logger.error.bind(logger)
    };
  }
  getDbLogger(category: string) {
    return new DbLogger(this.getLogger(category));
  }
}
