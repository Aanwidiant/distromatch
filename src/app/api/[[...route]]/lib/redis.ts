import Redis from 'ioredis';

let redisInstance: Redis | null = null;

export function getRedis(): Redis {
    if (!redisInstance) {
        const isUpstash = process.env.REDIS_USE_TLS === 'true';

        redisInstance = new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: Number.parseInt(process.env.REDIS_PORT || '6379', 10),
            password: process.env.REDIS_PASSWORD || undefined,
            db: Number.parseInt(process.env.REDIS_DB || '0', 10),
            maxRetriesPerRequest: 3,
            ...(isUpstash && { tls: {} }),
        });

        redisInstance.on('connect', () => {
            console.log('Redis connected');
        });
        redisInstance.on('error', (err) => {
            console.error('Redis error:', err.message);
        });
    }
    return redisInstance;
}

export const redis = getRedis();

/**
 * Optional helpers
 */
export async function redisSet(
    key: string,
    value: string,
    ttlInSeconds?: number
): Promise<'OK' | null> {
    if (ttlInSeconds) {
        return redis.set(key, value, 'EX', ttlInSeconds);
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
