import { Context } from 'hono';
import { db } from '../lib/db';
import { generateUniqueSlug } from '../lib/slug';
import { createDistroSchema } from '../validator';
import { buildPaginationMeta, getPagination } from '../lib';
import { and, desc, asc, eq, ilike, or, sql } from 'drizzle-orm';
import { distros, distroStatusEnum, distroLevelEnum } from '@/db/schema';
import { calculateOverallRating } from '../lib/overall-rating';
import { s3CreateDocument, s3DeleteDocument } from '../lib/s3';

export async function createDistro(c: Context) {
    try {
        const body = await c.req.json();

        const parsed = createDistroSchema.safeParse(body);

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

        const slug = await generateUniqueSlug(data.name);

        const existing = await db.query.distros.findFirst({
            where: eq(distros.slug, slug),
        });

        if (existing) {
            return c.json(
                {
                    success: false,
                    message: 'Distro already exists',
                },
                409
            );
        }

        const ratingInput = {
            ux_rating: Number(data.ux_rating ?? 0),
            performance_rating: Number(data.performance_rating ?? 0),
            stability_rating: Number(data.stability_rating ?? 0),
            features_rating: Number(data.features_rating ?? 0),
            support_rating: Number(data.support_rating ?? 0),
        };

        const payload = {
            name: data.name,
            slug,
            logo: data.logo ?? null,
            homepage_url: data.homepage_url ?? null,
            docs_url: data.docs_url ?? [],
            overall_rating: calculateOverallRating(ratingInput),
            ux_rating: String(data.ux_rating ?? 0),
            performance_rating: String(data.performance_rating ?? 0),
            stability_rating: String(data.stability_rating ?? 0),
            features_rating: String(data.features_rating ?? 0),
            support_rating: String(data.support_rating ?? 0),
            total_reviews: Number(data.total_reviews ?? 0),
            target_user_level:
                data.target_user_level as (typeof distroLevelEnum.enumValues)[number],
            distro_type: data.distro_type ?? [],
            based_on: data.based_on ?? [],
            origin_country: data.origin_country ?? [],
            architectures: data.architectures ?? [],
            desktop_environments: data.desktop_environments ?? [],
            categories: data.categories ?? [],
            status: data.status ?? 'ACTIVE',
            description: data.description ?? '',
            source_url: data.source_url ?? [],
            taken_at: data.taken_at ? new Date(data.taken_at) : new Date(),
        };

        await db.insert(distros).values(payload).returning();

        return c.json({
            success: true,
            message: 'Distro created successfully',
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

export async function createDistrosBulk(c: Context) {
    try {
        const body = await c.req.json();

        if (!Array.isArray(body)) {
            return c.json(
                {
                    success: false,
                    message: 'Payload must be an array',
                },
                400
            );
        }

        const results = [];

        for (const item of body) {
            const parsed = createDistroSchema.safeParse(item);

            if (!parsed.success) {
                results.push({
                    success: false,
                    name: item.name,
                    error: parsed.error.flatten(),
                });
                continue;
            }

            const data = parsed.data;

            const slug = await generateUniqueSlug(data.name);

            const existing = await db.query.distros.findFirst({
                where: eq(distros.slug, slug),
            });

            if (existing) {
                results.push({
                    success: false,
                    name: data.name,
                    message: 'Distro already exists',
                });
                continue;
            }

            const ratingInput = {
                ux_rating: Number(data.ux_rating ?? 0),
                performance_rating: Number(data.performance_rating ?? 0),
                stability_rating: Number(data.stability_rating ?? 0),
                features_rating: Number(data.features_rating ?? 0),
                support_rating: Number(data.support_rating ?? 0),
            };

            const payload = {
                name: data.name,
                slug,
                logo: data.logo ?? null,
                homepage_url: data.homepage_url ?? null,
                docs_url: data.docs_url ?? [],
                overall_rating: calculateOverallRating(ratingInput),

                ux_rating: String(data.ux_rating ?? 0),
                performance_rating: String(data.performance_rating ?? 0),
                stability_rating: String(data.stability_rating ?? 0),
                features_rating: String(data.features_rating ?? 0),
                support_rating: String(data.support_rating ?? 0),
                total_reviews: Number(data.total_reviews ?? 0),

                target_user_level:
                    data.target_user_level as (typeof distroLevelEnum.enumValues)[number],

                distro_type: data.distro_type ?? [],
                based_on: data.based_on ?? [],
                origin_country: data.origin_country ?? [],
                architectures: data.architectures ?? [],
                desktop_environments: data.desktop_environments ?? [],
                categories: data.categories ?? [],

                status: data.status ?? 'ACTIVE',
                description: data.description ?? '',
                source_url: data.source_url ?? [],
                taken_at: data.taken_at ? new Date(data.taken_at) : new Date(),
            };

            const [created] = await db.insert(distros).values(payload).returning();

            results.push({
                success: true,
                name: created.name,
            });
        }

        return c.json({
            success: true,
            message: 'Bulk distro import completed',
            results,
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

export async function getDistros(c: Context) {
    try {
        const { page, limit, search, status, target_level, sort_by, sort_order } = c.req.query();

        const { currentPage, pageSize, offset } = getPagination(page, limit);

        const searchCondition = search
            ? or(ilike(distros.name, `%${search}%`), ilike(distros.slug, `%${search}%`))
            : undefined;

        const statusCondition = status
            ? eq(distros.status, status as (typeof distroStatusEnum.enumValues)[number])
            : undefined;

        const levelCondition = target_level
            ? eq(
                  distros.target_user_level,
                  target_level as (typeof distroLevelEnum.enumValues)[number]
              )
            : undefined;

        const whereClause = and(searchCondition, statusCondition, levelCondition);

        const sortColumnMap = {
            name: distros.name,
            slug: distros.slug,
            logo: distros.logo,
            created_at: distros.created_at,
            total_reviews: distros.total_reviews,
            overall_rating: distros.overall_rating,
        } as const;

        const orderColumn =
            sortColumnMap[sort_by as keyof typeof sortColumnMap] ?? distros.created_at;

        const orderFn = sort_order === 'asc' ? asc(orderColumn) : desc(orderColumn);

        const totalResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(distros)
            .where(whereClause);

        const total = Number(totalResult[0]?.count || 0);

        const data = await db
            .select({
                id: distros.id,
                name: distros.name,
                slug: distros.slug,
                logo: distros.logo,
                status: distros.status,
                total_reviews: distros.total_reviews,
                overall_rating: distros.overall_rating,
            })
            .from(distros)
            .where(whereClause)
            .limit(pageSize)
            .offset(offset)
            .orderBy(orderFn);

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

export async function getDistroBySlug(c: Context) {
    try {
        const slug = c.req.param('slug');

        if (!slug) {
            return c.json(
                {
                    success: false,
                    message: 'Distro slug is required',
                },
                400
            );
        }

        const distro = await db.select().from(distros).where(eq(distros.slug, slug)).limit(1);

        if (!distro.length) {
            return c.json(
                {
                    success: false,
                    message: 'Distro not found',
                },
                404
            );
        }

        return c.json({
            success: true,
            data: distro[0],
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

export async function updateDistro(c: Context) {
    try {
        const id = c.req.param('id');
        const body = await c.req.json();

        if (!id) {
            return c.json(
                {
                    success: false,
                    message: 'Distro id is required',
                },
                400
            );
        }

        const parsed = createDistroSchema.partial().safeParse(body);

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

        const existing = await db.query.distros.findFirst({
            where: eq(distros.id, Number(id)),
        });

        if (!existing) {
            return c.json(
                {
                    success: false,
                    message: 'Distro not found',
                },
                404
            );
        }

        let slug = existing.slug;

        if (data.name && data.name !== existing.name) {
            slug = await generateUniqueSlug(data.name);
        }

        const ratingInput = {
            ux_rating: Number(data.ux_rating ?? existing.ux_rating ?? 0),
            performance_rating: Number(data.performance_rating ?? existing.performance_rating ?? 0),
            stability_rating: Number(data.stability_rating ?? existing.stability_rating ?? 0),
            features_rating: Number(data.features_rating ?? existing.features_rating ?? 0),
            support_rating: Number(data.support_rating ?? existing.support_rating ?? 0),
        };

        const payload = {
            name: data.name ?? existing.name,
            slug,

            logo: data.logo ?? existing.logo,
            homepage_url: data.homepage_url ?? existing.homepage_url,
            docs_url: data.docs_url ?? existing.docs_url,

            overall_rating: calculateOverallRating(ratingInput),

            ux_rating: String(ratingInput.ux_rating),
            performance_rating: String(ratingInput.performance_rating),
            stability_rating: String(ratingInput.stability_rating),
            features_rating: String(ratingInput.features_rating),
            support_rating: String(ratingInput.support_rating),

            target_user_level: (data.target_user_level ??
                existing.target_user_level) as (typeof distroLevelEnum.enumValues)[number],

            distro_type: data.distro_type ?? existing.distro_type,
            based_on: data.based_on ?? existing.based_on,
            origin_country: data.origin_country ?? existing.origin_country,
            architectures: data.architectures ?? existing.architectures,
            desktop_environments: data.desktop_environments ?? existing.desktop_environments,
            categories: data.categories ?? existing.categories,

            status: (data.status ??
                existing.status) as (typeof distroStatusEnum.enumValues)[number],

            description: data.description ?? existing.description,
            source_url: data.source_url ?? existing.source_url,

            taken_at: data.taken_at ? new Date(data.taken_at) : existing.taken_at,

            updated_at: new Date(),
        };

        await db
            .update(distros)
            .set(payload)
            .where(eq(distros.id, Number(id)))
            .returning();

        return c.json({
            success: true,
            message: 'Distro updated successfully',
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

export async function deleteDistro(c: Context) {
    try {
        const id = c.req.param('id');

        if (!id) {
            return c.json(
                {
                    success: false,
                    message: 'Distro id is required',
                },
                400
            );
        }

        const existing = await db.query.distros.findFirst({
            where: eq(distros.id, Number(id)),
        });

        if (!existing) {
            return c.json(
                {
                    success: false,
                    message: 'Distro not found',
                },
                404
            );
        }

        await db.delete(distros).where(eq(distros.id, Number(id)));

        return c.json({
            success: true,
            message: 'Distro deleted successfully',
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

export async function changeDistroLogo(c: Context) {
    try {
        const distroId = Number(c.req.param('id'));

        const formData = await c.req.formData();
        const file = formData.get('logo');

        if (!file || !(file instanceof File)) {
            return c.json(
                {
                    success: false,
                    message: 'Logo file is required',
                },
                400
            );
        }

        const currentDistro = await db.query.distros.findFirst({
            where: eq(distros.id, distroId),
        });

        if (!currentDistro) {
            return c.json(
                {
                    success: false,
                    message: 'Distro not found',
                },
                404
            );
        }

        const uploaded = await s3CreateDocument(file, 'distros');

        if (currentDistro.logo) {
            try {
                await s3DeleteDocument('distros', currentDistro.logo);
            } catch {
                //
            }
        }

        await db
            .update(distros)
            .set({
                logo: uploaded.filename,
            })
            .where(eq(distros.id, distroId));

        return c.json({
            success: true,
            message: 'Distro logo updated successfully',
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

export async function removeDistroLogo(c: Context) {
    try {
        const distroId = Number(c.req.param('id'));

        const distro = await db.query.distros.findFirst({
            where: eq(distros.id, distroId),
        });

        if (!distro) {
            return c.json(
                {
                    success: false,
                    message: 'Distro not found',
                },
                404
            );
        }

        if (!distro.logo) {
            return c.json({
                success: true,
                message: 'No distro logo to remove',
            });
        }

        try {
            await s3DeleteDocument('distros', distro.logo);
        } catch {
            //
        }

        await db
            .update(distros)
            .set({
                logo: null,
            })
            .where(eq(distros.id, distroId));

        return c.json({
            success: true,
            message: 'Distro logo removed successfully',
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
