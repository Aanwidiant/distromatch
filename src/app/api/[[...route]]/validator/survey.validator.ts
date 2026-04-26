import { z } from 'zod';

const rating = z.number().int().min(1).max(5);

export const createSurveySchema = z.object({
    dss_run_id: z.string().min(2),
    q1_ux: rating,
    q2_ux: rating,
    q3_performance: rating,
    q4_performance: rating,
    q5_stability: rating,
    q6_stability: rating,
    q7_features: rating,
    q8_features: rating,
    q9_support: rating,
    q10_support: rating,
    q11_level_pref: rating,
    q12_level_pref: rating,
});
