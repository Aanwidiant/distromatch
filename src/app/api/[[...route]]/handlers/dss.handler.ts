import { Context } from 'hono';
import { db } from '../lib/db';
import { eq } from 'drizzle-orm';
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
} from '@/db/schema';

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

// 2) directional distance: penalize only when distro is "easier" (more beginner) than user's pref
function getDistanceDirectional(userPrefRaw: number, targetUserLevel: number): number {
    const diff = targetUserLevel - userPrefRaw; // can be fractional
    return Math.max(0, diff); // penalize only if target is more 'beginner' than user preference
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
            const dist = getDistanceDirectional(userPrefRaw, targetLevelNum);
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

        // prepare top results
        const topN = sys ? parseNum(sys.top_n_recommendations ?? 5) : 5;
        const top = ranked.slice(0, topN).map((r) => {
            const distro = allDistros.find((d) => d.id === r.distro_id);
            return {
                distro_id: r.distro_id,
                score: r.score,
                rank: r.rank,
                name: distro?.name ?? null,
            };
        });

        return {
            dssRunId,
            top,
        };
    });

    return ctx.json({ ok: true, result: res });
}
