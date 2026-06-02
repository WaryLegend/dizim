import { createRateLimitMiddleware } from '../../../middlewares/rate-limiter';

export default createRateLimitMiddleware({
  windowMs: 60 * 60 * 1000,
  maxRequests: 5,
  keyPrefix: 'rl:contact:',
  message: 'Too many contact requests. Please try again later.',
});
