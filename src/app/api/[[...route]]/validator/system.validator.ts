import { z } from 'zod';

export const createSystemSettingSchema = z.object({
    name: z.string().min(2),

    lambda_param: z.number().min(0).max(1).optional(),
    max_distance: z.number().int().positive().optional(),
    median_reviews: z.number().int().optional(),
    total_distros: z.number().int().positive().optional(),
    top_n_recommendations: z.number().int().positive().optional(),

    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),

    updated_by: z.string().uuid().optional(),
});
