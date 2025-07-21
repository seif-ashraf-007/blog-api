import { rateLimit } from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 60, // 1-minute time window for requests limiting
  limit: 60, // allow a maximum of 60 requests per window per IP
  standardHeaders: 'draft-8', // Latest standard rate-limit headers,
  legacyHeaders: false, // disable deprecated X-RateLimit headers,
  message: {
    error:
      'You have sent too many requests in a given amount of time. Please try again later.',
  },
});

export default limiter;
