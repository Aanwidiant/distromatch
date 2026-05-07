import { Redis } from '@upstash/redis';

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export { redis };

export async function redisSet(
    key: string,
    value: string,
    ttlInSeconds?: number
): Promise<string | null> {
    if (ttlInSeconds) {
        return redis.set(key, value, { ex: ttlInSeconds });
    }
    return redis.set(key, value);
}

export async function redisGet(key: string): Promise<string | null> {
    return redis.get(key);
}

export async function redisDel(key: string): Promise<number> {
    return redis.del(key);
}

export async function redisIncr(key: string): Promise<number> {
    return redis.incr(key);
}

export async function checkRedisConnection(): Promise<{
    status: string;
    error: string;
}> {
    try {
        const pong = await redis.ping();
        if (pong === 'PONG') {
            return { status: 'connected', error: '' };
        }
        return { status: 'error', error: 'Unexpected ping response' };
    } catch (err) {
        return {
            status: 'error',
            error: err instanceof Error ? err.message : 'Unknown error',
        };
    }
}
