import Redis from 'ioredis';
import { Context, Next } from 'koa';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyPrefix: string;
  message: string;
}

let redisClient: Redis | null = null;

function getRedis(): Redis {
  if (!redisClient) {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    redisClient = new Redis(redisUrl, {
      enableOfflineQueue: false,
      maxRetriesPerRequest: null,
    });
  }
  return redisClient;
}

export function createRateLimitMiddleware(config: RateLimitConfig) {
  return async (ctx: Context, next: Next): Promise<void> => {
    const ip = ctx.ip || ctx.request.ip || 'unknown';
    const key = `${config.keyPrefix}${ip}`;

    try {
      const redis = getRedis();
      const current = await redis.incr(key);

      if (current === 1) {
        await redis.pexpire(key, config.windowMs);
      }

      ctx.set('X-RateLimit-Limit', String(config.maxRequests));
      ctx.set('X-RateLimit-Remaining', String(Math.max(0, config.maxRequests - current)));

      if (current > config.maxRequests) {
        const ttl = await redis.pttl(key);
        ctx.set('Retry-After', String(Math.ceil(ttl / 1000)));
        ctx.status = 429;
        ctx.body = {
          error: config.message,
          retryAfter: Math.ceil(ttl / 1000),
        };
        return;
      }

      await next();
    } catch (error) {
      console.error('[RateLimiter] Redis error, allowing request:', error);
      await next();
    }
  };
}
