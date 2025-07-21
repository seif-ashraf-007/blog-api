/** @copyright 2025 seif-ashraf-007
 * @license Apache-2.0
 */

import express from 'express';
import config from '@/config/index';
import cors from 'cors';
import type { CorsOptions } from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
import limiter from '@/lib/express_rate_limit';
import v1Routes from '@/routes/v1/index';
import { connectToDatabase, disconnectFromDatabase } from '@/lib/mongoose';
import logger from './lib/logger';

const app = express();

// Cors options
const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (
      config.NODE_ENV === 'development' ||
      !origin ||
      config.WHITELIST_ORIGINS.includes(origin)
    ) {
      callback(null, true);
    } else {
      callback(
        new Error(`CORS Error: ${origin} is not allowed by CORS`),
        false,
      );
      logger.warn(`CORS Error: ${origin} is not allowed by CORS`);
    }
  },
};
app.use(cors(corsOptions));

// JSON body parsing
app.use(express.json());

// URL-encoded
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Compression to reduce responses size
app.use(
  compression({
    threshold: 1024, // compress responses larger than 1KB
  }),
);

// Use helmet to enhance security by setting various HTTP headers
app.use(helmet());

// Apply rate limiting middleware to prevent excessive requests and enhance security.
app.use(limiter);

(async () => {
  try {
    await connectToDatabase();

    app.use('/api/v1', v1Routes);

    app.listen(config.PORT, () => {
      logger.info(`Server running: http://localhost:${config.PORT}`);
    });
  } catch (error) {
    logger.error(error, 'Failed to start the server');

    if (config.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
})();

const handleServerShutdown = async () => {
  try {
    await disconnectFromDatabase();
    logger.info(`Server SHUTDOWN`);
    process.exit(0);
  } catch (error) {
    logger.error(error, `Error during server shutdown `);
  }
};

process.on('SIGTERM', handleServerShutdown);
process.on('SIGINT', handleServerShutdown);
