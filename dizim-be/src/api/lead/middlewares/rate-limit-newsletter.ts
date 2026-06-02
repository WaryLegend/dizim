import { createRateLimitMiddleware } from '../../../middlewares/rate-limiter';

export default createRateLimitMiddleware({
  windowMs: 60 * 60 * 1000,
  maxRequests: 3,
  keyPrefix: 'rl:newsletter:',
  message: 'Too many subscription requests. Please try again later.',
});
