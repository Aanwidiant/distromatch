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

        let lambdaNum =
            typeof data.lambda_param === 'number'
                ? data.lambda_param
                : Number(data.lambda_param ?? -0.5);
        if (!Number.isFinite(lambdaNum)) lambdaNum = -0.5;
        lambdaNum = Math.min(0, Math.max(lambdaNum, -10));
        const lambdaStr = lambdaNum.toFixed(2);

        let priorCount =
            typeof data.prior_count === 'number'
                ? Math.floor(data.prior_count)
                : Number(data.prior_count ?? 5);
        if (!Number.isFinite(priorCount) || priorCount < 1) priorCount = 5;

        let scaleNum = typeof data.scale === 'number' ? data.scale : Number(data.scale ?? 1.0);
        if (!Number.isFinite(scaleNum)) scaleNum = 1.0;
        scaleNum = Math.min(10, Math.max(0, scaleNum));
        const scaleStr = scaleNum.toFixed(3);

        const maxDistance =
            typeof data.max_distance === 'number'
                ? Math.floor(data.max_distance)
                : Number(data.max_distance ?? 2);
        const totalDistros =
            typeof data.total_distros === 'number'
                ? Math.floor(data.total_distros)
                : Number(data.total_distros ?? 30);
        const topN =
            typeof data.top_n_recommendations === 'number'
                ? Math.floor(data.top_n_recommendations)
                : Number(data.top_n_recommendations ?? 5);

        const payload = {
            name: data.name,
            lambda_param: lambdaStr,
            max_distance: maxDistance,
            prior_count: priorCount,
            scale: scaleStr,
            total_distros: totalDistros,
            top_n_recommendations: topN,
            status: (data.status as 'ACTIVE' | 'INACTIVE') ?? 'ACTIVE',
            updated_by: authUser?.id ?? null,
        };

        await db.insert(system_settings).values(payload).returning();

        return c.json({
            success: true,
            message: 'System setting created successfully',
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
                max_distance: system_settings.max_distance,
                prior_count: system_settings.prior_count,
                lambda_param: system_settings.lambda_param,
                scale: system_settings.scale,
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
        const idParam = c.req.param('id');
        const body = await c.req.json();
        const authUser = c.get('user');

        if (!idParam) {
            return c.json({ success: false, message: 'System setting id is required' }, 400);
        }
        const id = Number(idParam);
        if (!Number.isFinite(id) || id <= 0) {
            return c.json({ success: false, message: 'Invalid system setting id' }, 400);
        }

        const parsed = createSystemSettingSchema.safeParse(body);
        if (!parsed.success) {
            return c.json(
                { success: false, message: 'Validation error', errors: parsed.error.flatten() },
                400
            );
        }
        const data = parsed.data;

        const existingById = await db.query.system_settings.findFirst({
            where: eq(system_settings.id, id),
        });
        if (!existingById) {
            return c.json({ success: false, message: 'System setting not found' }, 404);
        }

        const duplicate = await db.query.system_settings.findFirst({
            where: and(eq(system_settings.name, data.name), ne(system_settings.id, id)),
        });
        if (duplicate) {
            return c.json({ success: false, message: 'System setting name already exists' }, 409);
        }

        if (data.status === 'ACTIVE') {
            await db
                .update(system_settings)
                .set({ status: 'INACTIVE' })
                .where(and(eq(system_settings.status, 'ACTIVE'), ne(system_settings.id, id)));
        }

        const existingLambda = Number(existingById.lambda_param ?? -0.5);
        let lambdaNum =
            typeof data.lambda_param === 'number'
                ? data.lambda_param
                : Number.isFinite(existingLambda)
                  ? existingLambda
                  : -0.5;
        if (!Number.isFinite(lambdaNum)) lambdaNum = -0.5;
        lambdaNum = Math.min(0, Math.max(lambdaNum, -10));
        const lambdaStr = lambdaNum.toFixed(2);

        const existingPrior =
            typeof existingById.prior_count === 'number'
                ? existingById.prior_count
                : Number(existingById.prior_count ?? 5);
        let priorCount =
            typeof data.prior_count === 'number'
                ? Math.floor(data.prior_count)
                : Number.isFinite(existingPrior)
                  ? Math.floor(existingPrior)
                  : 5;
        if (!Number.isFinite(priorCount) || priorCount < 1) priorCount = 5;

        const existingScale = Number(existingById.scale ?? 1.0);
        let scaleNum =
            typeof data.scale === 'number'
                ? data.scale
                : Number.isFinite(existingScale)
                  ? existingScale
                  : 1.0;
        if (!Number.isFinite(scaleNum)) scaleNum = 1.0;
        scaleNum = Math.min(10, Math.max(0, scaleNum));
        const scaleStr = scaleNum.toFixed(3);

        const existingMaxDistance =
            typeof existingById.max_distance === 'number'
                ? existingById.max_distance
                : Number(existingById.max_distance ?? 2);
        const maxDistance =
            typeof data.max_distance === 'number'
                ? Math.floor(data.max_distance)
                : Number.isFinite(existingMaxDistance)
                  ? Math.floor(existingMaxDistance)
                  : 2;

        const existingTotalDistros =
            typeof existingById.total_distros === 'number'
                ? existingById.total_distros
                : Number(existingById.total_distros ?? 30);
        const totalDistros =
            typeof data.total_distros === 'number'
                ? Math.floor(data.total_distros)
                : Number.isFinite(existingTotalDistros)
                  ? Math.floor(existingTotalDistros)
                  : 30;

        const existingTopN =
            typeof existingById.top_n_recommendations === 'number'
                ? existingById.top_n_recommendations
                : Number(existingById.top_n_recommendations ?? 5);
        const topN =
            typeof data.top_n_recommendations === 'number'
                ? Math.floor(data.top_n_recommendations)
                : Number.isFinite(existingTopN)
                  ? Math.floor(existingTopN)
                  : 5;

        const payload = {
            name: data.name,
            lambda_param: lambdaStr,
            max_distance: maxDistance,
            prior_count: priorCount,
            scale: scaleStr,
            total_distros: totalDistros,
            top_n_recommendations: topN,
            status: (data.status as 'ACTIVE' | 'INACTIVE') ?? existingById.status,
            updated_by: authUser?.id ?? null,
            updated_at: new Date(),
        };

        const updated = await db
            .update(system_settings)
            .set(payload)
            .where(eq(system_settings.id, id))
            .returning();

        return c.json({
            success: true,
            message: 'System setting updated successfully',
            data: Array.isArray(updated) ? updated[0] : updated,
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
