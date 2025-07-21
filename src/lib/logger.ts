import pino from 'pino';
import dayjs from 'dayjs';

const log = pino({
  base: {
    pid: true,
  },
  timestamp: () => `,"time":"${dayjs().format()}"`,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      singleLine: false,
      ignore: 'pid,hostname',
      // optional: to ensure all properties are printed
      messageFormat: false,
    },
  },
});

export default log;
