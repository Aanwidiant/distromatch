import { db } from '../lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

function slugifyName(name: string): string {
    return name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '')
        .replace(/[^a-z0-9]/g, '');
}

export async function generateUniqueUsername(name: string): Promise<string> {
    const baseUsername = slugifyName(name);

    let username = baseUsername;
    let counter = 1;

    while (true) {
        const existingUser = await db.query.users.findFirst({
            where: eq(users.username, username),
        });

        if (!existingUser) {
            return username;
        }

        username = `${baseUsername}${counter}`;
        counter++;
    }
}
