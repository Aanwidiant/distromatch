import type { Context } from 'hono';
import { and, desc, eq, ilike, or, sql } from 'drizzle-orm';
import { db } from '../lib/db';
import { userRoleEnum, users, userStatusEnum } from '@/db/schema';
import { s3CreateDocument, s3DeleteDocument } from '../lib/s3';
import { buildPaginationMeta, generateUniqueUsername, getPagination, hashPassword } from '../lib';

export async function getMe(c: Context) {
    try {
        const authUser = c.get('user');

        const user = await db.query.users.findFirst({
            where: eq(users.id, authUser.id),
            columns: {
                password: false,
                refresh_token: false,
            },
        });

        if (!user) {
            return c.json({ success: false, message: 'User not found' }, 404);
        }

        return c.json({
            success: true,
            data: user,
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

export async function updateProfile(c: Context) {
    try {
        const authUser = c.get('user');
        const { name } = await c.req.json();

        const user = await db.query.users.findFirst({
            where: eq(users.id, authUser.id),
        });

        if (!user) {
            return c.json({ success: false, message: 'User not found' }, 404);
        }

        await db
            .update(users)
            .set({
                name: name ?? user.name,
                updated_at: new Date(),
            })
            .where(eq(users.id, user.id));

        return c.json({
            success: true,
            message: 'Profile updated successfully',
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

export async function changeProfilePhoto(c: Context) {
    try {
        const user = c.get('user');

        const formData = await c.req.formData();
        const file = formData.get('photo');

        if (!file || !(file instanceof File)) {
            return c.json(
                {
                    success: false,
                    message: 'Photo file is required',
                },
                400
            );
        }

        const currentUser = await db.query.users.findFirst({
            where: eq(users.id, user.id),
        });

        if (!currentUser) {
            return c.json(
                {
                    success: false,
                    message: 'User not found',
                },
                404
            );
        }

        const uploaded = await s3CreateDocument(file, 'avatars');

        if (currentUser.photo) {
            try {
                await s3DeleteDocument('avatars', currentUser.photo);
            } catch {
                //
            }
        }

        await db
            .update(users)
            .set({
                photo: uploaded.filename,
                updated_at: new Date(),
            })
            .where(eq(users.id, user.id))
            .returning({
                id: users.id,
                name: users.name,
                email: users.email,
                photo: users.photo,
            });

        return c.json({
            success: true,
            message: 'Profile photo updated successfully',
            photo: uploaded.filename,
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

export async function removeProfilePhoto(c: Context) {
    try {
        const authUser = c.get('user');

        const user = await db.query.users.findFirst({
            where: eq(users.id, authUser.id),
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

        if (!user.photo) {
            return c.json({
                success: true,
                message: 'No profile photo to remove',
            });
        }

        try {
            await s3DeleteDocument('avatars', user.photo);
        } catch {
            //
        }

        await db
            .update(users)
            .set({
                photo: null,
                updated_at: new Date(),
            })
            .where(eq(users.id, user.id))
            .returning({
                id: users.id,
                name: users.name,
                email: users.email,
                photo: users.photo,
            });

        return c.json({
            success: true,
            message: 'Profile photo removed successfully',
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

export async function createUserByAdmin(c: Context) {
    try {
        const { email, name, password, role } = await c.req.json();

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

        const hashedPassword = await hashPassword(password);

        const [newUser] = await db
            .insert(users)
            .values({
                email,
                name,
                username,
                password: hashedPassword,
                role: role ?? 'USER',
                email_verified: true,
            })
            .returning({
                id: users.id,
                email: users.email,
                name: users.name,
                username: users.username,
                role: users.role,
            });

        return c.json({
            success: true,
            message: 'User created successfully',
            data: newUser,
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

export async function adminUpdateUser(c: Context) {
    try {
        const userId = c.req.param('id');
        const { role, status } = await c.req.json();

        if (!userId) {
            return c.json({ success: false, message: 'User ID is required' }, 400);
        }

        const user = await db.query.users.findFirst({
            where: eq(users.id, userId),
        });

        if (!user) {
            return c.json({ success: false, message: 'User not found' }, 404);
        }

        await db
            .update(users)
            .set({
                role: role ?? user.role,
                status: status ?? user.status,
                updated_at: new Date(),
            })
            .where(eq(users.id, user.id));

        return c.json({
            success: true,
            message: 'User updated successfully',
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

export async function getUsers(c: Context) {
    try {
        const { page, limit, search, role, status } = c.req.query();

        const { currentPage, pageSize, offset } = getPagination(page, limit);

        const searchCondition = search
            ? or(
                  ilike(users.name, `%${search}%`),
                  ilike(users.email, `%${search}%`),
                  ilike(users.username, `%${search}%`)
              )
            : undefined;

        const roleCondition = role
            ? eq(users.role, role as (typeof userRoleEnum.enumValues)[number])
            : undefined;

        const statusCondition = status
            ? eq(users.status, status as (typeof userStatusEnum.enumValues)[number])
            : undefined;

        const whereClause = and(
            ...(searchCondition ? [searchCondition] : []),
            ...(roleCondition ? [roleCondition] : []),
            ...(statusCondition ? [statusCondition] : [])
        );

        const totalResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(users)
            .where(whereClause);

        const total = Number(totalResult[0]?.count || 0);

        const data = await db.query.users.findMany({
            where: whereClause,
            limit: pageSize,
            offset,
            orderBy: [desc(users.created_at)],
            columns: {
                password: false,
                refresh_token: false,
            },
        });

        return c.json({
            success: true,
            data,
            meta: buildPaginationMeta(currentPage, pageSize, total),
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
