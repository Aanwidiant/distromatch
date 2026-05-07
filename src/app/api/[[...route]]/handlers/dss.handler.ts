import { Context } from 'hono';
import { db } from '../lib/db';
import { and, asc, desc, eq, sql } from 'drizzle-orm';
import {
    dss_runs,
    surveys,
    weight_survey,
    distros,
    topsis_meta,
    topsis_result,
    penalty_results,
    bayesian_results,
    rankings,
    system_settings,
    type DistroLevel,
    users,
} from '@/db/schema';
import { buildPaginationMeta, getPagination } from '../lib';

const value = (a: number, b: number): number => (a + b) / 2;
const total = (a: number, b: number, c: number, d: number, e: number): number => a + b + c + d + e;
const ratio = (value: number, total: number): number => (total === 0 ? 0 : value / total);

function mapPreferenceLevelToEnum(level: number): DistroLevel {
    const rounded = Math.round(level);

    if (rounded === 1) return 'Advanced Experience Required';
    if (rounded === 2) return 'Intermediate Experience Required';
    return 'Beginner Friendly';
}

function mapEnumToPreferenceLevel(level: DistroLevel): number {
    if (level === 'Advanced Experience Required') return 1;
    if (level === 'Intermediate Experience Required') return 2;
    return 3;
}

function getDivisor(values: number[]): number {
    return Math.sqrt(values.reduce((acc, x) => acc + x * x, 0));
}

function normalizeByDivisor(values: number[], divisor: number): number[] {
    if (!divisor || divisor === 0) return values.map(() => 0);
    return values.map((x) => x / divisor);
}

function weightedScore(values: number[], weight: number): number[] {
    return values.map((v) => v * weight);
}

function getIdealPositive(values: number[], attribute: 'BENEFIT' | 'COST'): number {
    return attribute === 'BENEFIT' ? Math.max(...values) : Math.min(...values);
}

function getIdealNegative(values: number[], attribute: 'BENEFIT' | 'COST'): number {
    return attribute === 'COST' ? Math.max(...values) : Math.min(...values);
}

function getDistanceToIdealPositive(row: number[], aPlus: number[]): number {
    const sumSq = row.reduce((acc, x, j) => acc + (aPlus[j] - x) ** 2, 0);
    return Math.sqrt(sumSq);
}

function getDistanceToIdealNegative(row: number[], aMinus: number[]): number {
    const sumSq = row.reduce((acc, x, j) => acc + (x - aMinus[j]) ** 2, 0);
    return Math.sqrt(sumSq);
}

function getPreferenceValue(dPlus: number, dMinus: number): number {
    const denom = dMinus + dPlus;
    return denom === 0 ? 0 : dMinus / denom;
}

// Bayesian (shrink cc_score)
function getShrinkageCoefficient(totalReview: number, priorCount = 5): number {
    const k = Math.max(1, priorCount);
    const denom = totalReview + k;
    return denom === 0 ? 0 : Math.min(1, Math.max(0, totalReview / denom));
}

function getConfidenceAdjustment(
    shrinkageCoefficient: number,
    observed: number,
    meanObserved: number,
    totalReview?: number
): number {
    if (typeof totalReview === 'number' && totalReview === 0) return observed; // trust observed if no reviews
    return shrinkageCoefficient * observed + (1 - shrinkageCoefficient) * meanObserved;
}

// Penalty after bayesian
// 1) continuous mapping (no ceil/round) -> float in [1,3]
function mapScoreToPreferenceRaw(scoreAvg: number): number {
    return (scoreAvg - 1) / 2 + 1; // continuous 1..3
}

function getDistanceSymmetric(userPrefRaw: number, targetUserLevel: number): number {
    return Math.abs(targetUserLevel - userPrefRaw);
}

function getDistanceNorm(distance: number): number {
    return distance / 2; // max distance = 2 -> normalized 0..1
}

function getPenalty(distanceNorm: number, lambda = -0.5, exponent = 2): number {
    const raw = lambda * Math.pow(distanceNorm, exponent);
    return Math.max(raw, -0.99); // safety clamp
}

function getUtilityFromConfAdj(confAdj: number, penalty: number, scale = 1.0): number {
    const u = confAdj + penalty * scale;
    return Math.min(1, Math.max(0, u)); // clamp 0..1
}

// Ranking util (type-safe)
function rankByScore<T extends { distro_id: number; score: number }>(
    items: T[],
    options?: { tieBreaker?: (item: T) => number; epsilon?: number }
) {
    const eps = options?.epsilon ?? 1e-9;
    const tieBreaker = options?.tieBreaker;

    const sorted = [...items].sort((a, b) => {
        const sa = Number(a.score ?? 0);
        const sb = Number(b.score ?? 0);

        if (Math.abs(sb - sa) > eps) return sb - sa;

        if (tieBreaker) {
            const ta = Number(tieBreaker(a) ?? 0);
            const tb = Number(tieBreaker(b) ?? 0);
            return tb - ta;
        }

        return 0;
    });

    let lastScore: number | null = null;
    let lastRank = 0;
    return sorted.map((item, idx) => {
        const score = Number(item.score ?? 0);
        if (lastScore === null || Math.abs(score - lastScore) > eps) {
            lastRank = idx + 1;
            lastScore = score;
        }
        return { ...item, rank: lastRank };
    });
}

/* parse numeric yang sering dikembalikan string oleh driver */
function parseNum(v: unknown): number {
    if (v === null || v === undefined) return 0;
    if (typeof v === 'number') return v;
    if (typeof v === 'string') {
        const n = Number(v);
        return Number.isNaN(n) ? 0 : n;
    }
    return 0;
}

export async function runDssPipelineTest(ctx: Context) {
    const body = await ctx.req.json();
    const surveyInput = body?.survey;
    const user = ctx.get('user');
    const userId = user?.id;

    if (!userId || !surveyInput) {
        return ctx.json({ error: 'user_id dan survey required' }, 400);
    }

    const res = await db.transaction(async (tx) => {
        // 1) create dss_run
        const insertedRuns = await tx.insert(dss_runs).values({ user_id: userId }).returning();
        const dssRunRow = Array.isArray(insertedRuns) ? insertedRuns[0] : insertedRuns;
        const dssRunId = dssRunRow.id as string;

        // 2) insert survey
        await tx.insert(surveys).values({
            dss_run_id: dssRunId,
            q1_ux: surveyInput.q1_ux,
            q2_ux: surveyInput.q2_ux,
            q3_performance: surveyInput.q3_performance,
            q4_performance: surveyInput.q4_performance,
            q5_stability: surveyInput.q5_stability,
            q6_stability: surveyInput.q6_stability,
            q7_features: surveyInput.q7_features,
            q8_features: surveyInput.q8_features,
            q9_support: surveyInput.q9_support,
            q10_support: surveyInput.q10_support,
            q11_level_pref: surveyInput.q11_level_pref,
            q12_level_pref: surveyInput.q12_level_pref,
        });

        // 3) calculate weights
        const uxVal = value(surveyInput.q1_ux, surveyInput.q2_ux);
        const perfVal = value(surveyInput.q3_performance, surveyInput.q4_performance);
        const stabilityVal = value(surveyInput.q5_stability, surveyInput.q6_stability);
        const featuresVal = value(surveyInput.q7_features, surveyInput.q8_features);
        const supportVal = value(surveyInput.q9_support, surveyInput.q10_support);
        const levelPrefVal = value(surveyInput.q11_level_pref, surveyInput.q12_level_pref);

        const tot = total(uxVal, perfVal, stabilityVal, featuresVal, supportVal);

        const uxWeight = ratio(uxVal, tot);
        const perfWeight = ratio(perfVal, tot);
        const stabilityWeight = ratio(stabilityVal, tot);
        const featuresWeight = ratio(featuresVal, tot);
        const supportWeight = ratio(supportVal, tot);

        // continuous user preference (float) for penalty computation
        const userPrefRaw = mapScoreToPreferenceRaw(levelPrefVal); // float in [1,3]
        // kept for storing/display: convert to enum by rounding
        const userPrefEnum = mapPreferenceLevelToEnum(Math.round(levelPrefVal));

        // 4) save weight_survey
        await tx.insert(weight_survey).values({
            dss_run_id: dssRunId,
            ux_weight: String(uxWeight),
            performance_weight: String(perfWeight),
            stability_weight: String(stabilityWeight),
            features_weight: String(featuresWeight),
            support_weight: String(supportWeight),
            user_pref_score: Math.round(levelPrefVal),
            user_pref_level: userPrefEnum,
        });

        // 5) get all distros
        const allDistros = (await tx.select().from(distros)) as (typeof distros.$inferSelect)[];
        if (!allDistros.length) throw new Error('No distros found');

        // 6) collect criteria arrays
        const uxArr = allDistros.map((d) => parseNum(d.ux_rating));
        const perfArr = allDistros.map((d) => parseNum(d.performance_rating));
        const stabilityArr = allDistros.map((d) => parseNum(d.stability_rating));
        const featuresArr = allDistros.map((d) => parseNum(d.features_rating));
        const supportArr = allDistros.map((d) => parseNum(d.support_rating));

        // 7) denominators
        const denomUx = getDivisor(uxArr);
        const denomPerf = getDivisor(perfArr);
        const denomStability = getDivisor(stabilityArr);
        const denomFeatures = getDivisor(featuresArr);
        const denomSupport = getDivisor(supportArr);

        // 8) normalized
        const normUx = normalizeByDivisor(uxArr, denomUx);
        const normPerf = normalizeByDivisor(perfArr, denomPerf);
        const normStability = normalizeByDivisor(stabilityArr, denomStability);
        const normFeatures = normalizeByDivisor(featuresArr, denomFeatures);
        const normSupport = normalizeByDivisor(supportArr, denomSupport);

        // 9) weighted vectors
        const weightedUxFull = weightedScore(normUx, uxWeight);
        const weightedPerfFull = weightedScore(normPerf, perfWeight);
        const weightedStabilityFull = weightedScore(normStability, stabilityWeight);
        const weightedFeaturesFull = weightedScore(normFeatures, featuresWeight);
        const weightedSupportFull = weightedScore(normSupport, supportWeight);

        // 10) batch insert topsis_result initial rows
        const topsisPayloads = allDistros.map((d, i) => ({
            dss_run_id: dssRunId,
            distro_id: d.id,
            normalized_ux: String(normUx[i]),
            normalized_performance: String(normPerf[i]),
            normalized_stability: String(normStability[i]),
            normalized_features: String(normFeatures[i]),
            normalized_support: String(normSupport[i]),
            weighted_ux: String(weightedUxFull[i]),
            weighted_performance: String(weightedPerfFull[i]),
            weighted_stability: String(weightedStabilityFull[i]),
            weighted_features: String(weightedFeaturesFull[i]),
            weighted_support: String(weightedSupportFull[i]),
            cc_score: String(0),
        }));
        await tx.insert(topsis_result).values(topsisPayloads);

        // 11) compute ideal positive & negative (BENEFIT)
        const aPlus = [
            getIdealPositive(weightedUxFull, 'BENEFIT'),
            getIdealPositive(weightedPerfFull, 'BENEFIT'),
            getIdealPositive(weightedStabilityFull, 'BENEFIT'),
            getIdealPositive(weightedFeaturesFull, 'BENEFIT'),
            getIdealPositive(weightedSupportFull, 'BENEFIT'),
        ];
        const aMinus = [
            getIdealNegative(weightedUxFull, 'BENEFIT'),
            getIdealNegative(weightedPerfFull, 'BENEFIT'),
            getIdealNegative(weightedStabilityFull, 'BENEFIT'),
            getIdealNegative(weightedFeaturesFull, 'BENEFIT'),
            getIdealNegative(weightedSupportFull, 'BENEFIT'),
        ];

        // 12) save topsis_meta
        await tx.insert(topsis_meta).values({
            dss_run_id: dssRunId,
            denominator_ux: String(denomUx),
            denominator_performance: String(denomPerf),
            denominator_stability: String(denomStability),
            denominator_features: String(denomFeatures),
            denominator_support: String(denomSupport),
            positive_ux: String(aPlus[0]),
            positive_performance: String(aPlus[1]),
            positive_stability: String(aPlus[2]),
            positive_features: String(aPlus[3]),
            positive_support: String(aPlus[4]),
            negative_ux: String(aMinus[0]),
            negative_performance: String(aMinus[1]),
            negative_stability: String(aMinus[2]),
            negative_features: String(aMinus[3]),
            negative_support: String(aMinus[4]),
        });

        // 13) compute distances & cc_score, update topsis_result rows
        const topsisRows = (await tx
            .select()
            .from(topsis_result)
            .where(
                eq(topsis_result.dss_run_id, dssRunId)
            )) as (typeof topsis_result.$inferSelect)[];

        for (const r of topsisRows) {
            const weightedRow = [
                parseNum(r.weighted_ux),
                parseNum(r.weighted_performance),
                parseNum(r.weighted_stability),
                parseNum(r.weighted_features),
                parseNum(r.weighted_support),
            ];

            const dPlus = getDistanceToIdealPositive(weightedRow, aPlus);
            const dMinus = getDistanceToIdealNegative(weightedRow, aMinus);
            const cc = getPreferenceValue(dPlus, dMinus);

            await tx
                .update(topsis_result)
                .set({
                    distance_ideal_positive: String(dPlus),
                    distance_ideal_negative: String(dMinus),
                    cc_score: String(cc),
                })
                .where(eq(topsis_result.id, r.id as number));
        }

        // 14) fetch system settings
        const sysRows = (await tx
            .select()
            .from(system_settings)
            .where(
                eq(system_settings.status, 'ACTIVE')
            )) as (typeof system_settings.$inferSelect)[];
        const sys = sysRows.length ? sysRows[0] : null;
        const lambdaParam = sys ? parseNum(sys.lambda_param) : -0.5;
        const priorCount = sys ? parseNum(sys.prior_count ?? 5) : 5;
        const scale = sys ? parseNum(sys.scale ?? 1) : 1;

        // --- BAYESIAN (use cc_score as observed) ---
        // 15) fetch cc_scores to compute mean and bayes
        const topsisAfter = (await tx
            .select({
                distro_id: topsis_result.distro_id,
                cc_score: topsis_result.cc_score,
            })
            .from(topsis_result)
            .where(eq(topsis_result.dss_run_id, dssRunId))) as {
            distro_id: number;
            cc_score: unknown;
        }[];

        const meanCcScore =
            topsisAfter.reduce((acc, t) => acc + parseNum(t.cc_score), 0) /
            Math.max(topsisAfter.length, 1);

        // 16) compute bayesian results (shrink cc_score -> confidence_adjusted_score)
        const bayesPayloads: (typeof bayesian_results.$inferInsert)[] = topsisAfter.map((tr) => {
            const distroRow = allDistros.find((d) => d.id === tr.distro_id)!;
            const totalReviews = parseNum(distroRow.total_reviews);
            const observed = parseNum(tr.cc_score);
            const shrinkage = getShrinkageCoefficient(totalReviews, priorCount);
            const confAdj = getConfidenceAdjustment(shrinkage, observed, meanCcScore, totalReviews);
            return {
                dss_run_id: dssRunId,
                distro_id: tr.distro_id,
                shrinkage_coefficient: String(shrinkage),
                confidence_adjusted_score: String(confAdj),
            };
        });

        await tx.insert(bayesian_results).values(bayesPayloads);

        // 17) compute penalty & utility FOR EACH distro using confAdj as base, batch insert penalty_results
        const penaltyPayloads: (typeof penalty_results.$inferInsert)[] = [];
        const rankables: { distro_id: number; score: number; total_reviews: number }[] = [];

        for (const bp of bayesPayloads) {
            const distroRow = allDistros.find((d) => d.id === bp.distro_id)!;
            const targetLevelNum = mapEnumToPreferenceLevel(
                distroRow.target_user_level as DistroLevel
            );

            // use continuous + directional distance
            const dist = getDistanceSymmetric(userPrefRaw, targetLevelNum);
            const distNorm = getDistanceNorm(dist);
            const penalty = getPenalty(distNorm, lambdaParam); // exponent default 2
            const confAdj = parseNum(bp.confidence_adjusted_score);
            const util = getUtilityFromConfAdj(confAdj, penalty, scale);

            penaltyPayloads.push({
                dss_run_id: dssRunId,
                distro_id: bp.distro_id,
                distance: String(dist),
                distance_normalized: String(distNorm),
                penalty_value: String(penalty),
                utility_score: String(util),
            });

            rankables.push({
                distro_id: bp.distro_id,
                score: util,
                total_reviews: parseNum(distroRow.total_reviews),
            });
        }

        await tx.insert(penalty_results).values(penaltyPayloads);

        // 18) ranking based on utility (after penalty)
        const ranked = rankByScore(rankables, {
            tieBreaker: (it) => it.total_reviews,
            epsilon: 1e-9,
        });

        await tx.delete(rankings).where(eq(rankings.dss_run_id, dssRunId));

        const rankingPayloads = ranked.map((r) => ({
            dss_run_id: dssRunId,
            distro_id: r.distro_id,
            rank_position: r.rank,
        }));
        await tx.insert(rankings).values(rankingPayloads);

        return {
            dssRunId,
        };
    });

    return ctx.json({
        success: true,
        ...res,
    });
}

export async function getDssRunList(c: Context) {
    try {
        const { page, limit, sort_by, sort_order } = c.req.query();
        const usernameParam = c.req.param('username');

        const { currentPage, pageSize, offset } = getPagination(page, limit);

        const authUser = c.get('user');
        const userId = authUser?.id;

        const userResult = await db
            .select({ username: users.username })
            .from(users)
            .where(eq(users.id, userId))
            .limit(1);

        const authUsername = userResult[0]?.username;

        if (!authUsername) {
            return c.json({ success: false, message: 'User not found' }, 404);
        }

        if (usernameParam !== authUsername) {
            return c.json({ success: false, message: 'Forbidden' }, 403);
        }

        const whereClause = eq(dss_runs.user_id, userId);

        const sortColumnMap = {
            created_at: dss_runs.created_at,
        } as const;

        const orderColumn =
            sortColumnMap[sort_by as keyof typeof sortColumnMap] ?? dss_runs.created_at;

        const orderFn = sort_order === 'asc' ? asc(orderColumn) : desc(orderColumn);

        const totalResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(dss_runs)
            .where(whereClause);

        const total = Number(totalResult[0]?.count || 0);

        const data = await db
            .select({
                id: dss_runs.id,
                created_at: dss_runs.created_at,
            })
            .from(dss_runs)
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

export async function getDssRunMeta(c: Context) {
    try {
        const runId = c.req.param('id');
        const username = c.req.param('username');

        if (!runId || !username) {
            return c.json({ success: false, message: 'Run ID and username are required' }, 400);
        }

        const result = await db
            .select({
                id: dss_runs.id,
                created_at: dss_runs.created_at,
                username: users.username,
            })
            .from(dss_runs)
            .innerJoin(users, eq(dss_runs.user_id, users.id))
            .where(and(eq(dss_runs.id, runId), eq(users.username, username)))
            .limit(1);

        const run = result[0];

        if (!run) {
            return c.json({ success: false, message: 'Run not found or not owned by user' }, 404);
        }

        return c.json({
            success: true,
            data: run,
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

export async function getDssRunDetails(c: Context) {
    try {
        const runId = c.req.param('runId');

        if (!runId) {
            return c.json({ success: false, message: 'Run ID is required' }, 400);
        }

        const [run] = await db.select().from(dss_runs).where(eq(dss_runs.id, runId)).limit(1);

        if (!run) {
            return c.json({ success: false, message: 'DSS run not found' }, 404);
        }

        const [survey, weights, topsisMeta, topsisRows, penaltyRows, bayesianRows, rankingRows] =
            await Promise.all([
                db
                    .select()
                    .from(surveys)
                    .where(eq(surveys.dss_run_id, runId))
                    .limit(1)
                    .then((r) => r[0] ?? null),

                db
                    .select()
                    .from(weight_survey)
                    .where(eq(weight_survey.dss_run_id, runId))
                    .limit(1)
                    .then((r) => r[0] ?? null),

                db
                    .select()
                    .from(topsis_meta)
                    .where(eq(topsis_meta.dss_run_id, runId))
                    .limit(1)
                    .then((r) => r[0] ?? null),

                db.select().from(topsis_result).where(eq(topsis_result.dss_run_id, runId)),

                db.select().from(penalty_results).where(eq(penalty_results.dss_run_id, runId)),

                db.select().from(bayesian_results).where(eq(bayesian_results.dss_run_id, runId)),

                db
                    .select()
                    .from(rankings)
                    .where(eq(rankings.dss_run_id, runId))
                    .orderBy(asc(rankings.rank_position)),
            ]);

        return c.json({
            success: true,
            data: {
                run,
                survey,
                weights,
                topsis: {
                    meta: topsisMeta,
                    results: topsisRows,
                },
                penalty: penaltyRows,
                bayesian: bayesianRows,
                rankings: rankingRows,
            },
        });
    } catch (error) {
        console.error('[getDssRunDetails]', error);
        return c.json({ success: false, message: 'Internal server error' }, 500);
    }
}

export async function getDssRunRecommendations(c: Context) {
    try {
        const runId = c.req.param('id');

        if (!runId) {
            return c.json({ success: false, message: 'Run ID is required' }, 400);
        }

        const [run] = await db
            .select({
                id: dss_runs.id,
                created_at: dss_runs.created_at,
                user_name: users.name,
            })
            .from(dss_runs)
            .innerJoin(users, eq(users.id, dss_runs.user_id))
            .where(eq(dss_runs.id, runId))
            .limit(1);

        if (!run) {
            return c.json({ success: false, message: 'DSS run not found' }, 404);
        }

        const [settings] = await db
            .select({ top_n: system_settings.top_n_recommendations })
            .from(system_settings)
            .where(eq(system_settings.status, 'ACTIVE'))
            .limit(1);

        const topN = settings?.top_n ?? 5;

        const recommendations = await db
            .select({
                rank_position: rankings.rank_position,
                distro_id: distros.id,
                name: distros.name,
                slug: distros.slug,
                logo: distros.logo,
                homepage_url: distros.homepage_url,
                total_reviews: distros.total_reviews,
                overall_rating: distros.overall_rating,
                final_score: penalty_results.utility_score,
            })
            .from(rankings)
            .innerJoin(distros, eq(distros.id, rankings.distro_id))
            .innerJoin(
                topsis_result,
                and(
                    eq(topsis_result.dss_run_id, rankings.dss_run_id),
                    eq(topsis_result.distro_id, rankings.distro_id)
                )
            )
            .innerJoin(
                penalty_results,
                and(
                    eq(penalty_results.dss_run_id, rankings.dss_run_id),
                    eq(penalty_results.distro_id, rankings.distro_id)
                )
            )
            .innerJoin(
                bayesian_results,
                and(
                    eq(bayesian_results.dss_run_id, rankings.dss_run_id),
                    eq(bayesian_results.distro_id, rankings.distro_id)
                )
            )
            .where(eq(rankings.dss_run_id, runId))
            .orderBy(asc(rankings.rank_position))
            .limit(topN);

        return c.json({
            success: true,
            data: {
                run_id: runId,
                run_created_at: run.created_at,
                user_name: run.user_name, // ✅ expose ke FE
                top_n: topN,
                recommendations,
            },
        });
    } catch (error) {
        console.error('[getDssRunRecommendations]', error);
        return c.json({ success: false, message: 'Internal server error' }, 500);
    }
}

export async function getSurveyData(c: Context) {
    try {
        const runId = c.req.param('id');

        if (!runId) {
            return c.json({ success: false, message: 'Run ID is required' }, 400);
        }

        const survey = await db.query.surveys.findFirst({
            where: (s, { eq }) => eq(s.dss_run_id, runId),
        });

        const weight = await db.query.weight_survey.findFirst({
            where: (w, { eq }) => eq(w.dss_run_id, runId),
        });

        if (!survey || !weight) {
            return c.json({ error: 'Not found' }, 404);
        }

        return c.json({
            success: true,
            data: {
                questions: {
                    q1_ux: survey.q1_ux,
                    q2_ux: survey.q2_ux,
                    q3_performance: survey.q3_performance,
                    q4_performance: survey.q4_performance,
                    q5_stability: survey.q5_stability,
                    q6_stability: survey.q6_stability,
                    q7_features: survey.q7_features,
                    q8_features: survey.q8_features,
                    q9_support: survey.q9_support,
                    q10_support: survey.q10_support,
                    q11_level_pref: survey.q11_level_pref,
                    q12_level_pref: survey.q12_level_pref,
                },
                summary: {
                    ux: {
                        mean: (survey.q1_ux + survey.q2_ux) / 2,
                        weight: Number(weight.ux_weight),
                    },
                    performance: {
                        mean: (survey.q3_performance + survey.q4_performance) / 2,
                        weight: Number(weight.performance_weight),
                    },
                    stability: {
                        mean: (survey.q5_stability + survey.q6_stability) / 2,
                        weight: Number(weight.stability_weight),
                    },
                    features: {
                        mean: (survey.q7_features + survey.q8_features) / 2,
                        weight: Number(weight.features_weight),
                    },
                    support: {
                        mean: (survey.q9_support + survey.q10_support) / 2,
                        weight: Number(weight.support_weight),
                    },
                    preference: {
                        level: weight.user_pref_level,
                        score: weight.user_pref_score,
                    },
                },
            },
        });
    } catch {
        return c.json(
            {
                success: false,
                message: 'Internal server error',
            },
            500
        );
    }
}

export async function getDistroMatrix(c: Context) {
    try {
        const rows = await db
            .select({
                distro: distros.name,
                ux: distros.ux_rating,
                performance: distros.performance_rating,
                stability: distros.stability_rating,
                features: distros.features_rating,
                support: distros.support_rating,
            })
            .from(distros);

        return c.json({
            success: true,
            data: { rows },
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

export async function getDenominatorData(c: Context) {
    try {
        const runId = c.req.param('id');

        if (!runId) {
            return c.json({ success: false, message: 'Run ID is required' }, 400);
        }

        const meta = await db.query.topsis_meta.findFirst({
            where: (m, { eq }) => eq(m.dss_run_id, runId),
        });

        if (!meta) return c.json({ error: 'Not found' }, 404);

        return c.json({
            success: true,
            data: {
                ux: meta.denominator_ux,
                performance: meta.denominator_performance,
                stability: meta.denominator_stability,
                features: meta.denominator_features,
                support: meta.denominator_support,
            },
        });
    } catch {
        return c.json(
            {
                success: false,
                message: 'Internal server error',
            },
            500
        );
    }
}

export async function getNormalizeData(c: Context) {
    try {
        const runId = c.req.param('id');

        if (!runId) {
            return c.json({ success: false, message: 'Run ID is required' }, 400);
        }

        const rows = await db.query.topsis_result.findMany({
            where: (t, { eq }) => eq(t.dss_run_id, runId),
            with: {
                distro: true,
            },
        });

        const rows_map = rows.map((r) => ({
            distro: r.distro.name,
            ux: r.normalized_ux,
            performance: r.normalized_performance,
            stability: r.normalized_stability,
            features: r.normalized_features,
            support: r.normalized_support,
        }));

        return c.json({
            success: true,
            data: { rows_map },
        });
    } catch {
        return c.json(
            {
                success: false,
                message: 'Internal server error',
            },
            500
        );
    }
}

export async function getWeightedData(c: Context) {
    try {
        const runId = c.req.param('id');

        if (!runId) {
            return c.json({ success: false, message: 'Run ID is required' }, 400);
        }

        const rows = await db.query.topsis_result.findMany({
            where: (t, { eq }) => eq(t.dss_run_id, runId),
            with: { distro: true },
        });

        const rows_map = rows.map((r) => ({
            distro: r.distro.name,
            ux: r.weighted_ux,
            performance: r.weighted_performance,
            stability: r.weighted_stability,
            features: r.weighted_features,
            support: r.weighted_support,
        }));

        return c.json({
            success: true,
            data: { rows_map },
        });
    } catch {
        return c.json(
            {
                success: false,
                message: 'Internal server error',
            },
            500
        );
    }
}

export async function getIdealSolution(c: Context) {
    try {
        const runId = c.req.param('id');

        if (!runId) {
            return c.json({ success: false, message: 'Run ID is required' }, 400);
        }

        const meta = await db.query.topsis_meta.findFirst({
            where: (m, { eq }) => eq(m.dss_run_id, runId),
        });

        if (!meta) return c.json({ error: 'Not found' }, 404);

        return c.json({
            success: true,
            data: {
                positive: {
                    ux: meta.positive_ux,
                    performance: meta.positive_performance,
                    stability: meta.positive_stability,
                    features: meta.positive_features,
                    support: meta.positive_support,
                },
                negative: {
                    ux: meta.negative_ux,
                    performance: meta.negative_performance,
                    stability: meta.negative_stability,
                    features: meta.negative_features,
                    support: meta.negative_support,
                },
            },
        });
    } catch {
        return c.json(
            {
                success: false,
                message: 'Internal server error',
            },
            500
        );
    }
}

export async function getTopsisCalc(c: Context) {
    try {
        const runId = c.req.param('id');

        if (!runId) {
            return c.json({ success: false, message: 'Run ID is required' }, 400);
        }

        const rows = await db.query.topsis_result.findMany({
            where: (b, { eq }) => eq(b.dss_run_id, runId),
            with: { distro: true },
        });

        const rows_map = rows.map((r) => ({
            distro: r.distro.name,
            distance_ideal_positive: r.distance_ideal_positive,
            distance_ideal_negative: r.distance_ideal_negative,
            cc_score: r.cc_score,
        }));

        return c.json({
            success: true,
            data: { rows_map },
        });
    } catch {
        return c.json(
            {
                success: false,
                message: 'Internal server error',
            },
            500
        );
    }
}

export async function getBayesianCalc(c: Context) {
    try {
        const runId = c.req.param('id');

        if (!runId) {
            return c.json({ success: false, message: 'Run ID is required' }, 400);
        }

        const rows = await db.query.bayesian_results.findMany({
            where: (b, { eq }) => eq(b.dss_run_id, runId),
            with: { distro: true },
        });

        const rows_map = rows.map((r) => ({
            distro: r.distro.name,
            total_reviews: r.distro.total_reviews,
            shrinkage: r.shrinkage_coefficient,
            score: r.confidence_adjusted_score,
        }));

        return c.json({
            success: true,
            data: { rows_map },
        });
    } catch {
        return c.json(
            {
                success: false,
                message: 'Internal server error',
            },
            500
        );
    }
}

export async function getPenaltyCalc(c: Context) {
    try {
        const runId = c.req.param('id');

        if (!runId) {
            return c.json({ success: false, message: 'Run ID is required' }, 400);
        }

        const rows = await db
            .select({
                distro: distros.name,
                distance: penalty_results.distance,
                distanceNorm: penalty_results.distance_normalized,
                penalty: penalty_results.penalty_value,
                utility: penalty_results.utility_score,
                rank: rankings.rank_position,
            })
            .from(penalty_results)
            .innerJoin(distros, eq(penalty_results.distro_id, distros.id))
            .leftJoin(
                rankings,
                and(
                    eq(rankings.dss_run_id, penalty_results.dss_run_id),
                    eq(rankings.distro_id, penalty_results.distro_id)
                )
            )
            .where(eq(penalty_results.dss_run_id, runId))
            .orderBy(asc(rankings.rank_position));

        return c.json({
            success: true,
            data: { rows },
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

export const handleDeleteDssRun = async (c: Context) => {
    const user = c.get('user');

    const dssRunId = String(c.req.param('id'));

    const dssRun = await db.query.dss_runs.findFirst({
        where: eq(dss_runs.id, dssRunId),
    });

    if (!dssRun) {
        return c.json({ success: false, message: 'DSS run not found' }, 404);
    }

    const isOwner = dssRun.user_id === user.id;
    const isAdmin = user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
        return c.json({ success: false, message: 'Forbidden' }, 403);
    }

    await db.delete(dss_runs).where(eq(dss_runs.id, dssRunId));

    return c.json({
        success: true,
        message: 'DSS run deleted successfully',
    });
};
