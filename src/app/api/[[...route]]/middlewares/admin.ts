import { createMiddleware } from 'hono/factory';

export const admin = createMiddleware(async (c, next) => {
    const user = c.get('user');

    if (!user) {
        return c.json(
            {
                success: false,
                message: 'Unauthorized',
            },
            401
        );
    }

    if (user.role !== 'ADMIN') {
        return c.json(
            {
                success: false,
                message: 'Forbidden: Admin access only',
            },
            403
        );
    }

    await next();
});
