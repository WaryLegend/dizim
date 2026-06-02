import { createRateLimitMiddleware } from '../../../middlewares/rate-limiter';

export default createRateLimitMiddleware({
  windowMs: 60 * 60 * 1000,
  maxRequests: 3,
  keyPrefix: 'rl:cta:',
  message: 'Too many requests. Please try again later.',
});
