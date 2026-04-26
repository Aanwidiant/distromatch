import { db } from './db';
import { distros } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function generateUniqueSlug(name: string) {
    const baseSlug = slugify(name);

    let slug = baseSlug;
    let index = 0;

    const MAX_TRY = 50;

    while (index < MAX_TRY) {
        const existing = await db.query.distros.findFirst({
            where: eq(distros.slug, slug),
        });

        if (!existing) {
            return slug;
        }

        index++;
        slug = `${baseSlug}-${index}`;
    }

    throw new Error('Failed to generate unique slug');
}

function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[–—]/g, '-')
        .replace(/['"]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
}
