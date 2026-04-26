import { Context } from 'hono';
import { db } from '../lib/db';
import { and, desc, eq, ilike, ne, sql } from 'drizzle-orm';
import { createSystemSettingSchema } from '../validator';
import { system_settings, systemSettingStatusEnum, users } from '@/db/schema';
import { buildPaginationMeta, getPagination } from '../lib';

export async function createSystemSetting(c: Context) {
    try {
        const body = await c.req.json();
        const authUser = c.get('user');

        const parsed = createSystemSettingSchema.safeParse(body);

        if (!parsed.success) {
            return c.json(
                {
                    success: false,
                    message: 'Validation error',
                    errors: parsed.error.flatten(),
                },
                400
            );
        }

        const data = parsed.data;

        const existing = await db.query.system_settings.findFirst({
            where: eq(system_settings.name, data.name),
        });

        if (existing) {
            return c.json(
                {
                    success: false,
                    message: 'System setting already exists',
                },
                409
            );
        }

        if (data.status === 'ACTIVE') {
            await db
                .update(system_settings)
                .set({ status: 'INACTIVE' })
                .where(eq(system_settings.status, 'ACTIVE'));
        }

        const payload = {
            name: data.name,

            lambda_param: String(data.lambda_param ?? 0.5),
            max_distance: data.max_distance ?? 2,
            median_reviews: data.median_reviews ?? null,
            total_distros: data.total_distros ?? 30,
            top_n_recommendations: data.top_n_recommendations ?? 5,

            status:
                (data.status as (typeof systemSettingStatusEnum.enumValues)[number]) ?? 'ACTIVE',

            updated_by: authUser?.id ?? null,
        };

        await db.insert(system_settings).values(payload).returning();

        return c.json({
            success: true,
            message: 'System created successfully',
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

export async function getSystemSettings(c: Context) {
    try {
        const { page, limit, search, status } = c.req.query();

        const { currentPage, pageSize, offset } = getPagination(page, limit);

        const searchCondition = search ? ilike(system_settings.name, `%${search}%`) : undefined;

        const statusCondition = status
            ? eq(
                  system_settings.status,
                  status as (typeof systemSettingStatusEnum.enumValues)[number]
              )
            : undefined;

        const whereClause = and(searchCondition, statusCondition);

        const totalResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(system_settings)
            .where(whereClause);

        const total = Number(totalResult[0]?.count || 0);

        const data = await db
            .select({
                id: system_settings.id,
                name: system_settings.name,
                status: system_settings.status,
                updated_by: system_settings.updated_by,
                updated_by_name: users.name,
                updated_by_photo: users.photo,
                created_at: system_settings.created_at,
                updated_at: system_settings.updated_at,
            })
            .from(system_settings)
            .leftJoin(users, eq(system_settings.updated_by, users.id))
            .where(whereClause)
            .limit(pageSize)
            .offset(offset)
            .orderBy(desc(system_settings.created_at));

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

export async function getSystemSettingById(c: Context) {
    try {
        const id = c.req.param('id');

        if (!id) {
            return c.json(
                {
                    success: false,
                    message: 'System setting id is required',
                },
                400
            );
        }

        const setting = await db
            .select({
                id: system_settings.id,
                name: system_settings.name,

                lambda_param: system_settings.lambda_param,
                max_distance: system_settings.max_distance,
                median_reviews: system_settings.median_reviews,
                total_distros: system_settings.total_distros,
                top_n_recommendations: system_settings.top_n_recommendations,

                status: system_settings.status,

                updated_by: system_settings.updated_by,
                updated_by_name: users.name,
                updated_by_photo: users.photo,

                created_at: system_settings.created_at,
                updated_at: system_settings.updated_at,
            })
            .from(system_settings)
            .leftJoin(users, eq(system_settings.updated_by, users.id))
            .where(eq(system_settings.id, Number(id)))
            .limit(1);

        if (!setting.length) {
            return c.json(
                {
                    success: false,
                    message: 'System setting not found',
                },
                404
            );
        }

        return c.json({
            success: true,
            data: setting[0],
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

export async function updateSystemSetting(c: Context) {
    try {
        const id = c.req.param('id');
        const body = await c.req.json();
        const authUser = c.get('user');

        if (!id) {
            return c.json(
                {
                    success: false,
                    message: 'System setting id is required',
                },
                400
            );
        }

        const parsed = createSystemSettingSchema.safeParse(body);

        if (!parsed.success) {
            return c.json(
                {
                    success: false,
                    message: 'Validation error',
                    errors: parsed.error.flatten(),
                },
                400
            );
        }

        const data = parsed.data;

        const existingById = await db.query.system_settings.findFirst({
            where: eq(system_settings.id, Number(id)),
        });

        if (!existingById) {
            return c.json(
                {
                    success: false,
                    message: 'System setting not found',
                },
                404
            );
        }

        const duplicate = await db.query.system_settings.findFirst({
            where: ne(system_settings.id, Number(id)),
        });

        if (duplicate && duplicate.name === data.name) {
            return c.json(
                {
                    success: false,
                    message: 'System setting name already exists',
                },
                409
            );
        }

        if (data.status === 'ACTIVE') {
            await db
                .update(system_settings)
                .set({ status: 'INACTIVE' })
                .where(eq(system_settings.status, 'ACTIVE'));
        }

        const payload = {
            name: data.name,

            lambda_param: String(data.lambda_param ?? 0.5),
            max_distance: data.max_distance ?? 2,
            median_reviews: data.median_reviews ?? null,
            total_distros: data.total_distros ?? 30,
            top_n_recommendations: data.top_n_recommendations ?? 5,

            status:
                (data.status as (typeof systemSettingStatusEnum.enumValues)[number]) ??
                existingById.status,

            updated_by: authUser?.id ?? null,
            updated_at: new Date(),
        };

        await db
            .update(system_settings)
            .set(payload)
            .where(eq(system_settings.id, Number(id)))
            .returning();

        return c.json({
            success: true,
            message: 'System setting updated successfully',
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

export async function deleteSystemSetting(c: Context) {
    try {
        const id = c.req.param('id');

        if (!id) {
            return c.json(
                {
                    success: false,
                    message: 'System setting id is required',
                },
                400
            );
        }

        const existing = await db.query.system_settings.findFirst({
            where: eq(system_settings.id, Number(id)),
        });

        if (!existing) {
            return c.json(
                {
                    success: false,
                    message: 'System setting not found',
                },
                404
            );
        }

        const totalResult = await db.select({ count: sql<number>`count(*)` }).from(system_settings);

        const total = Number(totalResult[0]?.count || 0);

        if (total <= 1) {
            return c.json(
                {
                    success: false,
                    message: 'Cannot delete system setting. At least one configuration must exist.',
                },
                400
            );
        }

        await db.delete(system_settings).where(eq(system_settings.id, Number(id)));

        return c.json({
            success: true,
            message: 'System setting deleted successfully',
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
