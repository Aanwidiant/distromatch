import { z } from 'zod';

export const createDistroSchema = z.object({
    name: z.string().min(2),

    logo: z.string().optional(),
    homepage_url: z.string().url().optional(),

    docs_url: z.array(z.string().url()).optional(),

    ux_rating: z.number().min(0).max(5).optional(),
    performance_rating: z.number().min(0).max(5).optional(),
    stability_rating: z.number().min(0).max(5).optional(),
    features_rating: z.number().min(0).max(5).optional(),
    support_rating: z.number().min(0).max(5).optional(),
    total_reviews: z.number().int().min(0).optional(),

    target_user_level: z.enum([
        'Beginner Friendly',
        'Intermediate Experience Required',
        'Advanced Experience Required',
    ]),

    distro_type: z.array(z.string()).optional(),
    based_on: z.array(z.string()).optional(),
    origin_country: z.array(z.string()).optional(),
    architectures: z.array(z.string()).optional(),
    desktop_environments: z.array(z.string()).optional(),
    categories: z.array(z.string()).optional(),

    status: z.enum(['ACTIVE', 'INACTIVE', 'DEPRECATED']).optional(),

    description: z.string().optional(),

    source_url: z.array(z.string().url()).optional(),

    taken_at: z.string().datetime().optional(),
});
