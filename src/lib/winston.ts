import winston from 'winston';

import config from '@/config';

const { combine, timestamp, json, errors, align, printf, colorize } =
  winston.format;

const transports: winston.transport[] = [];

if (config.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.Console({
      format: combine(
        colorize({
          all: true, // Add colors to log levels
        }),
        timestamp({ format: 'YYY-MM-DD hh:mm:ss A' }), // Add timestamp to logs
        align(),
        printf(({ timestamp, level, message, ...meta }) => {
          const metaStr = Object.keys(meta).length
            ? `\n${JSON.stringify(meta)}`
            : '';

          return `${timestamp} [${level.toUpperCase()}]: ${message}${metaStr}`;
        }),
      ),
    }),
  );
}

// create a logger instance using winston
const logger = winston.createLogger({
  level: config.LOG_LEVEL, // set the default loggin level to 'info'
  format: combine(timestamp(), errors({ stack: true }), json()), // use JSON format for log messages
  transports,
  silent: config.NODE_ENV === 'test', // disable logging the test environment
});

export { logger };
