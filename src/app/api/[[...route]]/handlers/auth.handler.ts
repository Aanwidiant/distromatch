import type { Context } from 'hono';
import { eq } from 'drizzle-orm';
import { db } from '../lib/db';
import { users } from '@/db/schema';
import { comparePassword, hashPassword, validateStrongPassword } from '../lib/password';
import {
    generateAccessToken,
    generateRefreshToken,
    generateToken,
    JwtPayload,
    verifyRefreshToken,
    verifyToken,
} from '../lib/jwt';
import { redis } from '../lib/redis';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import { downloadImage, generateUniqueUsername } from '../lib';
import { s3CreateDocument } from '../lib/s3';
import { sendEmail } from '../utils/send-mail';

export async function register(c: Context) {
    try {
        const { email, name, password } = await c.req.json();

        if (!email || !name || !password) {
            return c.json(
                {
                    success: false,
                    message: 'Email, name, and password are required',
                },
                400
            );
        }

        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        if (existingUser) {
            return c.json(
                {
                    success: false,
                    message: 'Email already registered',
                },
                409
            );
        }

        const username = await generateUniqueUsername(name);

        const result = validateStrongPassword(password);

        if (!result.valid) {
            return c.json(
                {
                    success: false,
                    message: 'Weak password',
                    errors: result.errors,
                },
                400
            );
        }

        const hashedPassword = await hashPassword(password);

        const [newUser] = await db
            .insert(users)
            .values({
                email,
                name,
                username,
                password: hashedPassword,
                email_verified: false,
            })
            .returning({
                id: users.id,
                email: users.email,
                name: users.name,
                username: users.username,
            });

        const payload: JwtPayload = {
            id: newUser.id,
            email: newUser.email,
            role: 'USER',
            type: 'verify-email',
            exp: Math.floor(Date.now() / 1000) + 60 * 60,
        };

        const verifyToken = await generateToken(payload);

        const verifyLink = `${process.env.FRONTEND_URL}/verify-email?token=${verifyToken}`;

        await sendEmail({
            to: newUser.email,
            template: 'verify-email',
            props: {
                name: newUser.name,
                verifyLink,
            },
        });

        return c.json({
            success: true,
            message: 'User registered successfully. Please verify your email.',
        });
    } catch (error) {
        return c.json(
            {
                success: false,
                message: error instanceof Error ? error.message : 'Internal server error',
            },
            500
        );
    }
}

export async function resendVerification(c: Context) {
    const { email } = await c.req.json();

    const user = await db.query.users.findFirst({
        where: eq(users.email, email),
    });

    if (!user) {
        return c.json({ message: 'User not found' }, 404);
    }

    if (user.email_verified) {
        return c.json({ message: 'Email already verified' }, 400);
    }

    const token = await generateToken({
        id: user.id,
        email: user.email,
        role: user.role ?? 'USER',
        type: 'verify-email',
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
    });

    const verifyLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    await sendEmail({
        to: user.email,
        template: 'verify-email',
        props: {
            name: user.name,
            verifyLink,
        },
    });

    return c.json({
        success: true,
        message: 'Verification email resent',
    });
}

export async function verifyEmail(c: Context) {
    try {
        const token = c.req.query('token');

        if (!token) {
            return c.json(
                {
                    success: false,
                    message: 'Token is required',
                },
                400
            );
        }

        const payload = await verifyToken(token);

        if (payload.type !== 'verify-email') {
            return c.json(
                {
                    success: false,
                    message: 'Invalid token type',
                },
                400
            );
        }

        const user = await db.query.users.findFirst({
            where: eq(users.id, payload.id),
        });

        if (!user) {
            return c.json(
                {
                    success: false,
                    message: 'User not found',
                },
                404
            );
        }

        if (user.email_verified) {
            return c.json({
                success: true,
                message: 'Email already verified',
            });
        }

        await db
            .update(users)
            .set({
                email_verified: true,
                updated_at: new Date(),
            })
            .where(eq(users.id, user.id));

        return c.json({
            success: true,
            message: 'Email verified successfully',
        });
    } catch (error) {
        return c.json(
            {
                success: false,
                message: error instanceof Error ? error.message : 'Internal server error',
            },
            500
        );
    }
}

export async function loginBySystem(c: Context) {
    try {
        const { email, password } = await c.req.json();

        if (!email || !password) {
            return c.json(
                {
                    success: false,
                    message: 'Email and password are required',
                },
                400
            );
        }

        const user = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        if (!user) {
            return c.json(
                {
                    success: false,
                    message: 'User not found',
                },
                404
            );
        }

        if (!user.email_verified) {
            return c.json(
                {
                    success: false,
                    message: 'Please verify your email first',
                },
                401
            );
        }

        if (!user.password) {
            return c.json(
                {
                    success: false,
                    message:
                        'This account was registered using Google. Please sign in with Google and add a password first.',
                },
                400
            );
        }

        const isValidPassword = await comparePassword(password, user.password);

        if (!isValidPassword) {
            return c.json(
                {
                    success: false,
                    message: 'Invalid password',
                },
                401
            );
        }

        const payload: JwtPayload = {
            id: user.id,
            email: user.email,
            role: user.role ?? 'USER',
        };

        const accessToken = await generateAccessToken(payload);
        const refreshToken = await generateRefreshToken(payload);

        await redis.set(`session:${user.id}`, JSON.stringify(payload), 'EX', 60 * 60 * 24 * 7);

        await db
            .update(users)
            .set({
                refresh_token: refreshToken,
                session_expired_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            })
            .where(eq(users.id, user.id));

        setCookie(c, 'refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        });

        return c.json({
            success: true,
            message: 'Login successful',
            accessToken,
            user: payload,
        });
    } catch (error) {
        return c.json(
            {
                success: false,
                message: error instanceof Error ? error.message : 'Internal server error',
            },
            500
        );
    }
}

export async function loginByGoogle(c: Context) {
    try {
        const { token } = await c.req.json();

        if (!token) {
            return c.json({ success: false, message: 'Token is required' }, 400);
        }

        const googleRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!googleRes.ok) {
            return c.json({ success: false, message: 'Invalid Google token' }, 400);
        }

        const googleUser = (await googleRes.json()) as {
            email: string;
            name?: string;
            picture?: string;
        };

        if (!googleUser.email) {
            return c.json({ success: false, message: 'Email not found from Google' }, 400);
        }

        const user = await db.query.users.findFirst({
            where: eq(users.email, googleUser.email),
        });

        if (!user) {
            let filename: string | null = null;

            if (googleUser.picture) {
                const avatarFile = await downloadImage(googleUser.picture);

                const result = await s3CreateDocument(avatarFile, `avatars`);

                filename = result.filename;
            }

            const username = await generateUniqueUsername(googleUser.name || 'google_user');

            const [newUser] = await db
                .insert(users)
                .values({
                    email: googleUser.email,
                    name: googleUser.name || 'New User',
                    username: username,
                    password: '',
                    photo: filename,
                    email_verified: true,
                })
                .returning();

            const payload: JwtPayload = {
                id: newUser.id,
                email: newUser.email,
                role: newUser.role ?? 'USER',
            };

            const accessToken = await generateAccessToken(payload);
            const refreshToken = await generateRefreshToken(payload);

            await redis.set(
                `session:${newUser.id}`,
                JSON.stringify(payload),
                'EX',
                60 * 60 * 24 * 7
            );

            await db
                .update(users)
                .set({ refresh_token: refreshToken })
                .where(eq(users.id, newUser.id));

            setCookie(c, 'refresh_token', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict',
                path: '/',
                maxAge: 60 * 60 * 24 * 7,
            });

            return c.json({
                success: true,
                message: 'User registered & logged in with Google',
                accessToken,
                user: payload,
            });
        }

        const payload: JwtPayload = {
            id: user.id,
            email: user.email,
            role: user.role ?? 'USER',
        };

        const accessToken = await generateAccessToken(payload);
        const refreshToken = await generateRefreshToken(payload);

        await redis.set(`session:${user.id}`, JSON.stringify(payload), 'EX', 60 * 60 * 24 * 7);

        await db.update(users).set({ refresh_token: refreshToken }).where(eq(users.id, user.id));

        setCookie(c, 'refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
        });

        return c.json({
            success: true,
            message: 'Login with Google successful',
            accessToken,
            user: payload,
        });
    } catch (error) {
        return c.json(
            {
                success: false,
                message: error instanceof Error ? error.message : 'Internal server error',
            },
            500
        );
    }
}

export async function refreshToken(c: Context) {
    try {
        const oldRefreshToken = getCookie(c, 'refresh_token');

        if (!oldRefreshToken) {
            return c.json(
                {
                    success: false,
                    message: 'Refresh token missing',
                },
                401
            );
        }

        const payload = await verifyRefreshToken(oldRefreshToken);

        const user = await db.query.users.findFirst({
            where: eq(users.id, payload.id),
        });

        if (!user || user.refresh_token !== oldRefreshToken) {
            return c.json(
                {
                    success: false,
                    message: 'Invalid refresh token',
                },
                401
            );
        }

        const session = await redis.get(`session:${user.id}`);

        if (!session) {
            return c.json(
                {
                    success: false,
                    message: 'Session expired',
                },
                401
            );
        }

        const newPayload: JwtPayload = {
            id: user.id,
            email: user.email,
            role: user.role ?? 'USER',
        };

        const newAccessToken = await generateAccessToken(newPayload);
        const newRefreshToken = await generateRefreshToken(newPayload);

        await db
            .update(users)
            .set({
                refresh_token: newRefreshToken,
                session_expired_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            })
            .where(eq(users.id, user.id));

        await redis.expire(`session:${user.id}`, 60 * 60 * 24 * 7);

        setCookie(c, 'refresh_token', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        });

        return c.json({
            success: true,
            message: 'Token refreshed successfully',
            accessToken: newAccessToken,
        });
    } catch {
        return c.json(
            {
                success: false,
                message: 'Invalid or expired refresh token',
            },
            401
        );
    }
}

export async function changePassword(c: Context) {
    try {
        const authUser = c.get('user');
        const { oldPassword, newPassword } = await c.req.json();

        if (!authUser?.id) {
            return c.json({ success: false, message: 'Unauthorized' }, 401);
        }

        if (!newPassword) {
            return c.json(
                {
                    success: false,
                    message: 'New password is required',
                },
                400
            );
        }

        const user = await db.query.users.findFirst({
            where: eq(users.id, authUser.id),
        });

        if (!user) {
            return c.json({ success: false, message: 'User not found' }, 404);
        }

        if (user.provider === 'SYSTEM') {
            if (!oldPassword) {
                return c.json(
                    {
                        success: false,
                        message: 'Old password is required',
                    },
                    400
                );
            }

            const isValid = await comparePassword(oldPassword, user.password!);

            if (!isValid) {
                return c.json(
                    {
                        success: false,
                        message: 'Old password is incorrect',
                    },
                    401
                );
            }
        }

        const result = validateStrongPassword(newPassword);

        if (!result.valid) {
            return c.json(
                {
                    success: false,
                    message: 'Weak password',
                    errors: result.errors,
                },
                400
            );
        }

        const hashedPassword = await hashPassword(newPassword);

        await db
            .update(users)
            .set({
                password: hashedPassword,
                provider: 'SYSTEM',
                updated_at: new Date(),
                refresh_token: null,
            })
            .where(eq(users.id, user.id));

        await redis.del(`session:${user.id}`);

        return c.json({
            success: true,
            message: 'Password changed successfully, please re-login with new password.',
        });
    } catch (error) {
        return c.json(
            {
                success: false,
                message: error instanceof Error ? error.message : 'Internal server error',
            },
            500
        );
    }
}

export async function forgotPassword(c: Context) {
    try {
        const { email } = await c.req.json();

        if (!email) {
            return c.json(
                {
                    success: false,
                    message: 'Email is required',
                },
                400
            );
        }

        const user = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        if (!user) {
            return c.json({
                success: true,
                message: 'If the email exists, a password reset link has been sent.',
            });
        }

        const payload: JwtPayload = {
            id: user.id,
            email: user.email,
            role: user.role ?? 'USER',
            type: 'reset-password',
            exp: Math.floor(Date.now() / 1000) + 60 * 60,
        };

        const resetToken = await generateToken(payload);

        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

        await sendEmail({
            to: user.email,
            template: 'reset-password',
            props: {
                name: user.name,
                resetLink,
            },
        });

        return c.json({
            success: true,
            message: 'If the email exists, a password reset link has been sent.',
        });
    } catch (error) {
        return c.json(
            {
                success: false,
                message: error instanceof Error ? error.message : 'Internal server error',
            },
            500
        );
    }
}

export async function resetPassword(c: Context) {
    try {
        const { token, password } = await c.req.json();

        if (!token || !password) {
            return c.json(
                {
                    success: false,
                    message: 'Token and password are required',
                },
                400
            );
        }

        const payload = await verifyToken(token);

        if (payload.type !== 'reset-password') {
            return c.json(
                {
                    success: false,
                    message: 'Invalid token type',
                },
                400
            );
        }

        const user = await db.query.users.findFirst({
            where: eq(users.id, payload.id),
        });

        if (!user) {
            return c.json(
                {
                    success: false,
                    message: 'User not found',
                },
                404
            );
        }

        const result = validateStrongPassword(password);

        if (!result.valid) {
            return c.json(
                {
                    success: false,
                    message: 'Weak password',
                    errors: result.errors,
                },
                400
            );
        }

        const hashedPassword = await hashPassword(password);

        await db
            .update(users)
            .set({
                password: hashedPassword,
                updated_at: new Date(),
            })
            .where(eq(users.id, user.id));

        await redis.del(`session:${user.id}`);

        return c.json({
            success: true,
            message: 'Password has been reset successfully',
        });
    } catch (error) {
        return c.json(
            {
                success: false,
                message: error instanceof Error ? error.message : 'Internal server error',
            },
            500
        );
    }
}

export async function requestChangeEmail(c: Context) {
    try {
        const authUser = c.get('user');
        const { newEmail } = await c.req.json();

        if (!newEmail) {
            return c.json({ success: false, message: 'New email required' }, 400);
        }

        const user = await db.query.users.findFirst({
            where: eq(users.id, authUser.id),
        });

        if (!user) {
            return c.json({ success: false, message: 'User not found' }, 404);
        }

        const token = await generateToken({
            id: user.id,
            email: newEmail,
            role: user.role ?? 'USER',
            type: 'change-email',
            exp: Math.floor(Date.now() / 1000) + 60 * 60,
        });

        const verifyLink = `${process.env.FRONTEND_URL}/verify-change-email?token=${token}`;

        await sendEmail({
            to: newEmail,
            template: 'change-email',
            props: {
                name: user.name,
                oldEmail: user.email,
                newEmail,
                verifyLink,
            },
        });

        return c.json({
            success: true,
            message: 'Verification email sent to new email',
        });
    } catch (error) {
        return c.json(
            {
                success: false,
                message: error instanceof Error ? error.message : 'Internal server error',
            },
            500
        );
    }
}

export async function verifyChangeEmail(c: Context) {
    try {
        const token = c.req.query('token');

        if (!token) {
            return c.json({ success: false, message: 'Token required' }, 400);
        }

        const payload = await verifyToken(token);

        if (payload.type !== 'change-email') {
            return c.json(
                {
                    success: false,
                    message: 'Invalid token type',
                },
                400
            );
        }

        const user = await db.query.users.findFirst({
            where: eq(users.id, payload.id),
        });

        if (!user) {
            return c.json({ success: false, message: 'User not found' }, 404);
        }

        await db
            .update(users)
            .set({
                email: payload.email,
                email_verified: true,
                updated_at: new Date(),
            })
            .where(eq(users.id, user.id));

        return c.json({
            success: true,
            message: 'Email changed successfully',
        });
    } catch (error) {
        return c.json(
            {
                success: false,
                message: error instanceof Error ? error.message : 'Internal server error',
            },
            500
        );
    }
}

export async function logout(c: Context) {
    try {
        const refreshToken = getCookie(c, 'refresh_token');

        if (!refreshToken) {
            return c.json(
                {
                    success: false,
                    message: 'Refresh token missing',
                },
                401
            );
        }

        const payload = await verifyRefreshToken(refreshToken);

        await db
            .update(users)
            .set({
                refresh_token: null,
            })
            .where(eq(users.id, payload.id));

        await redis.del(`session:${payload.id}`);

        deleteCookie(c, 'refresh_token', {
            path: '/',
        });

        return c.json({
            success: true,
            message: 'Logout successful',
        });
    } catch {
        return c.json({
            success: true,
            message: 'Logout successful',
        });
    }
}

export async function deleteAccount(c: Context) {
    try {
        const authUser = c.get('user');
        const { email } = await c.req.json();

        const user = await db.query.users.findFirst({
            where: eq(users.id, authUser.id),
        });

        if (!user) {
            return c.json({ success: false, message: 'User not found' }, 404);
        }

        if (user.email) {
            if (!email) {
                return c.json({ success: false, message: 'Email required' }, 400);
            }

            if (email !== user.email) {
                return c.json({ success: false, message: 'Invalid email' }, 401);
            }
        }

        await redis.del(`session:${user.id}`);

        await db.delete(users).where(eq(users.id, user.id));

        return c.json({
            success: true,
            message: 'Account deleted successfully',
        });
    } catch (error) {
        return c.json(
            {
                success: false,
                message: error instanceof Error ? error.message : 'Internal server error',
            },
            500
        );
    }
}
