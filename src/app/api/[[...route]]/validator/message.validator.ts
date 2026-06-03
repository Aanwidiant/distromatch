import { z } from 'zod';

export const messageSchema = z.object({
    name: z.string().min(2).max(100),
    email: z.email(),
    phone: z.string().max(30).optional(),
    subject: z.string().min(3).max(150),
    message: z.string().min(10).max(5000),
});
