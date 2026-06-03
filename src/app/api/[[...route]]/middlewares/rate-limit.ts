import type { Context, Next } from 'hono';
import { getRedis, redisIncr } from '../lib/redis';

interface RateLimitOptions {
    keyPrefix: string;
    windowSec: number;
    max: number;
}

export const rateLimit = (options: RateLimitOptions) => {
    const { keyPrefix, windowSec, max } = options;

    return async (c: Context, next: Next) => {
        const ip = c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || 'unknown';

        const key = `rate_limit:${keyPrefix}:${ip}`;

        const redis = getRedis();

        const currentCount = await redisIncr(key);

        if (currentCount === 1) {
            await redis.expire(key, windowSec);
        }

        if (currentCount > max) {
            return c.json(
                {
                    success: false,
                    message: 'Too many requests, please try again later.',
                },
                429
            );
        }

        await next();
    };
};
