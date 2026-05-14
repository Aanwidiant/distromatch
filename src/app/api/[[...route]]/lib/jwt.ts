import { sign, verify } from 'hono/jwt';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const SECRET = process.env.JWT_SECRET!;

export type JwtPayload = {
    id: string;
    email: string;
    role: 'ADMIN' | 'USER';
    exp?: number;
    type?: string;
};

export async function generateAccessToken(payload: JwtPayload) {
    return await sign(
        {
            ...payload,
            exp: Math.floor(Date.now() / 1000) + 60 * 15,
        },
        ACCESS_SECRET,
        'HS256'
    );
}

export async function generateRefreshToken(payload: JwtPayload) {
    return await sign(
        {
            ...payload,
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
        },
        REFRESH_SECRET,
        'HS256'
    );
}

export async function generateToken(payload: JwtPayload) {
    return await sign(
        {
            ...payload,
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
        },
        SECRET,
        'HS256'
    );
}

export async function verifyAccessToken(token: string): Promise<JwtPayload> {
    const payload = await verify(token, ACCESS_SECRET, 'HS256');
    return payload as JwtPayload;
}

export async function verifyRefreshToken(token: string): Promise<JwtPayload> {
    const payload = await verify(token, REFRESH_SECRET, 'HS256');
    return payload as JwtPayload;
}

export async function verifyToken(token: string): Promise<JwtPayload> {
    const payload = await verify(token, SECRET, 'HS256');
    return payload as JwtPayload;
}
