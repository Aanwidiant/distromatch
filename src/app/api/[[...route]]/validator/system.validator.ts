import { z } from 'zod';

export const createSystemSettingSchema = z.object({
    name: z.string().min(2),
    lambda_param: z.number().min(-10).max(0).optional(),
    max_distance: z.number().int().min(0).optional(),
    prior_count: z.number().min(1).optional(),
    scale: z.number().min(0).max(10).optional(),
    exponent: z.number(),
    total_distros: z.number().int().min(1).optional(),
    top_n_recommendations: z.number().int().min(1).optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
    updated_by: z.string().uuid().optional(),
});
