import { Context } from 'hono';
import { db } from '../lib/db';
import { distros, dss_runs, surveys } from '@/db/schema';
import { createSurveySchema } from '../validator';

export async function createDssRun(c: Context) {
    try {
        const user = c.get('user');

        const [dssRun] = await db
            .insert(dss_runs)
            .values({
                user_id: user.id,
            })
            .returning();

        return c.json({
            success: true,
            message: 'DSS run created successfully',
            data: dssRun,
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

export async function createSurvey(c: Context) {
    try {
        const body = await c.req.json();

        const parsed = createSurveySchema.safeParse(body);

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

        const [createdSurvey] = await db
            .insert(surveys)
            .values({
                dss_run_id: data.dss_run_id,
                q1_ux: data.q1_ux,
                q2_ux: data.q2_ux,
                q3_performance: data.q3_performance,
                q4_performance: data.q4_performance,
                q5_stability: data.q5_stability,
                q6_stability: data.q6_stability,
                q7_features: data.q7_features,
                q8_features: data.q8_features,
                q9_support: data.q9_support,
                q10_support: data.q10_support,
                q11_level_pref: data.q11_level_pref,
                q12_level_pref: data.q12_level_pref,
            })
            .returning();

        return c.json({
            success: true,
            message: 'Survey created successfully',
            data: {
                survey: createdSurvey,
            },
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

export const value = (a: number, b: number): number => (a + b) / 2;

export const total = (a: number, b: number, c: number, d: number, e: number): number =>
    a + b + c + d + e;

export const ratio = (value: number, total: number): number => value / total;

export function mapScoreToPreferenceLevel(score: number): number {
    return (score - 1) / 2 + 1;
}

export async function getAllUxRatings() {
    const rows = await db
        .select({
            ux_rating: distros.ux_rating,
        })
        .from(distros);

    return rows.map((r) => Number(r.ux_rating));
}

export function getDivisor(values: number[]): number {
    return Math.sqrt(values.reduce((acc, x) => acc + x * x, 0));
}

export function normalizeByDivisor(values: number[]): number[] {
    const divisor = getDivisor(values);
    return values.map((x) => x / divisor);
}

export function getIdealPositive(values: number[], attribute: 'BENEFIT' | 'COST'): number {
    return attribute === 'BENEFIT' ? Math.max(...values) : Math.min(...values);
}

export function getIdealNegative(values: number[], attribute: 'BENEFIT' | 'COST'): number {
    return attribute === 'COST' ? Math.max(...values) : Math.min(...values);
}

/**
 * D+ = jarak alternatif ke solusi ideal positif (A+)
 * Rumus: sqrt( sum( (aPlus[j] - row[j])^2 ) )
 */
export function getDistanceToIdealPositive(
    row: number[], // nilai alternatif, contoh: [C125, D125, E125, F125, G125]
    aPlus: number[] // solusi ideal positif, contoh: [C159, D159, E159, F159, G159]
): number {
    const sumSq = row.reduce((acc, x, j) => acc + (aPlus[j] - x) ** 2, 0);
    return Math.sqrt(sumSq);
}

export function getDistanceToIdealNegative(
    row: number[], // contoh: [C125, D125, E125, F125, G125]
    aMinus: number[] // contoh: [C163, D163, E163, F163, G163]
): number {
    const sumSq = row.reduce((acc, x, j) => acc + (x - aMinus[j]) ** 2, 0);
    return Math.sqrt(sumSq);
}

export function getPreferenceValue(
    dPlus: number, // jarak ke ideal positif (D+)
    dMinus: number // jarak ke ideal negatif (D-)
): number {
    return dMinus / (dMinus + dPlus);
}

export function getDistance(userPrefLevel: number, targetUserLevel: number): number {
    return Math.abs(userPrefLevel - targetUserLevel);
}

export function getDistanceNorm(distance: number): number {
    return distance / 2;
}

export function getPenalty(distanceNorm: number, lambda: number = -0.5): number {
    return lambda * distanceNorm ** 2;
}

export function getUtility(ccScore: number, penalty: number): number {
    return ccScore * (1 + penalty);
}

export function getShrinkageCoefficient(totalReview: number, medianReview: number): number {
    return totalReview / (totalReview + medianReview);
}

export function getConfidenceAdjustment(
    shrinkageCoefficient: number,
    utility: number,
    meanUtility: number
): number {
    return shrinkageCoefficient * utility + (1 - shrinkageCoefficient) * meanUtility;
}

type RankedItem<T> = T & {
    rank: number;
};

export function rankByConfidenceScore<T>(
    items: T[],
    getScore: (item: T) => number
): RankedItem<T>[] {
    const sorted = [...items].sort((a, b) => getScore(b) - getScore(a));

    let lastScore: number | null = null;
    let lastRank = 0;

    return sorted.map((item, index) => {
        const score = getScore(item);

        if (lastScore === null || score !== lastScore) {
            lastRank = index + 1;
            lastScore = score;
        }

        return { ...item, rank: lastRank };
    });
}

// example
type DistroScore = {
    id: number;
    name: string;
    confidenceAdjustmentScore: number;
};

const data: DistroScore[] = [
    { id: 1, name: 'Ubuntu', confidenceAdjustmentScore: 0.8123 },
    { id: 2, name: 'Fedora', confidenceAdjustmentScore: 0.9031 },
    { id: 3, name: 'Mint', confidenceAdjustmentScore: 0.7564 },
];

// pakai function ranking
const ranked = rankByConfidenceScore(data, (x) => x.confidenceAdjustmentScore);

console.log(ranked);
/*
[
  { id: 2, name: "Fedora", confidenceAdjustmentScore: 0.9031, rank: 1 },
  { id: 1, name: "Ubuntu", confidenceAdjustmentScore: 0.8123, rank: 2 },
  { id: 3, name: "Mint", confidenceAdjustmentScore: 0.7564, rank: 3 }
]
*/
