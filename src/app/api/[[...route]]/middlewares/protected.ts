import { createMiddleware } from 'hono/factory';
import { verifyAccessToken } from '../lib/jwt';
import { redis } from '../lib/redis';

type AuthUser = {
    id: string;
    email: string;
    role: string;
};

export const protect = createMiddleware(async (c, next) => {
    try {
        const authHeader = c.req.header('Authorization');

        if (!authHeader?.startsWith('Bearer ')) {
            return c.json(
                {
                    success: false,
                    message: 'Unauthorized',
                },
                401
            );
        }

        const token = authHeader.split(' ')[1];

        const payload = await verifyAccessToken(token);

        if (!payload?.id) {
            return c.json(
                {
                    success: false,
                    message: 'Invalid token',
                },
                401
            );
        }

        const session = await redis.get(`session:${payload.id}`);

        if (!session) {
            return c.json(
                {
                    success: false,
                    message: 'Session expired',
                },
                401
            );
        }

        const user: AuthUser = JSON.parse(session);

        if (!user?.id || user.id !== payload.id) {
            return c.json(
                {
                    success: false,
                    message: 'Invalid session',
                },
                401
            );
        }

        c.set('user', user);

        await next();
    } catch {
        return c.json(
            {
                success: false,
                message: 'Unauthorized',
            },
            401
        );
    }
});
