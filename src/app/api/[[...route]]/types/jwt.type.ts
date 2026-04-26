export type JwtPayload = {
    id: string;
    email: string;
    role: 'ADMIN' | 'USER';
    exp?: number;
};
