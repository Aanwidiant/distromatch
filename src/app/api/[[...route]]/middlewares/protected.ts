import { createMiddleware } from 'hono/factory';
import { verifyAccessToken } from '../lib/jwt';
import { redis } from '../lib/redis';
import { getCookie } from 'hono/cookie';

type AuthUser = {
    id: string;
    email: string;
    role: string;
};

export const protect = createMiddleware(async (c, next) => {
    try {
        const token = getCookie(c, 'access_token');

        if (!token) {
            return c.json(
                {
                    success: false,
                    message: 'Unauthorized: No token found',
                },
                401
            );
        }

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
