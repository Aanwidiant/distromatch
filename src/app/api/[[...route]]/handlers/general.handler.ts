import type { Context } from 'hono';
import { sendEmail } from '../utils/send-mail';
import { messageSchema } from '../validator';
import { count, desc, eq, sql } from 'drizzle-orm';
import { db } from '../lib/db';
import { distros, dss_runs, rankings, users } from '@/db/schema';

export async function getDashboardData(c: Context) {
    try {
        // STATS
        const [
            totalUsersResult,
            activeUsersResult,
            verifiedUsersResult,
            totalDistrosResult,
            activeDistrosResult,
            totalRunsResult,
        ] = await Promise.all([
            db.select({ count: count() }).from(users),
            db.select({ count: count() }).from(users).where(eq(users.status, 'ACTIVE')),
            db.select({ count: count() }).from(users).where(eq(users.email_verified, true)),
            db.select({ count: count() }).from(distros),
            db.select({ count: count() }).from(distros).where(eq(distros.status, 'ACTIVE')),
            db.select({ count: count() }).from(dss_runs),
        ]);

        // TOP RECOMMENDED DISTROS
        const topDistros = await db
            .select({
                distro_id: distros.id,
                distro_name: distros.name,
                total_top1: count(),
            })
            .from(rankings)
            .innerJoin(distros, eq(rankings.distro_id, distros.id))
            .where(eq(rankings.rank_position, 1))
            .groupBy(distros.id, distros.name)
            .orderBy(desc(count()))
            .limit(5);

        // RECENT USERS
        const recentUsers = await db
            .select({
                id: users.id,
                name: users.name,
                email: users.email,
                role: users.role,
                status: users.status,
                created_at: users.created_at,
            })
            .from(users)
            .orderBy(desc(users.created_at))
            .limit(5);

        // RECENT DSS RUNS
        const recentRuns = await db
            .select({
                id: dss_runs.id,
                created_at: dss_runs.created_at,
                username: users.username,
                name: users.name,
            })
            .from(dss_runs)
            .innerJoin(users, eq(dss_runs.user_id, users.id))
            .orderBy(desc(dss_runs.created_at))
            .limit(5);

        // RUNS TREND (LAST 7 DAYS)
        const runsTrend = await db
            .select({
                date: sql<string>`
                    TO_CHAR(${dss_runs.created_at}, 'YYYY-MM-DD')
                `,
                total: count(),
            })
            .from(dss_runs)
            .groupBy(sql`TO_CHAR(${dss_runs.created_at}, 'YYYY-MM-DD')`)
            .orderBy(sql`TO_CHAR(${dss_runs.created_at}, 'YYYY-MM-DD') ASC`)
            .limit(7);

        return c.json({
            success: true,
            data: {
                stats: {
                    totalUsers: totalUsersResult[0]?.count ?? 0,

                    activeUsers: activeUsersResult[0]?.count ?? 0,

                    verifiedUsers: verifiedUsersResult[0]?.count ?? 0,

                    totalDistros: totalDistrosResult[0]?.count ?? 0,

                    activeDistros: activeDistrosResult[0]?.count ?? 0,

                    totalRuns: totalRunsResult[0]?.count ?? 0,
                },
                topDistros,
                recentUsers,
                recentRuns,
                runsTrend,
            },
        });
    } catch (error) {
        console.error(error);
        return c.json(
            {
                success: false,
                message: 'Internal server error',
            },
            500
        );
    }
}

export const sendContactMessage = async (c: Context) => {
    try {
        const body = await c.req.json();

        const data = messageSchema.parse(body);

        await sendEmail({
            to: process.env.CONTACT_RECEIVER_EMAIL || '',
            replyTo: data.email,
            template: 'contact-message',
            props: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                subject: data.subject,
                message: data.message,
            },
        });

        return c.json(
            {
                success: true,
                message: 'Message sent successfully',
            },
            200
        );
    } catch {
        return c.json(
            {
                success: false,
                message: 'Failed to send message',
            },
            400
        );
    }
};
