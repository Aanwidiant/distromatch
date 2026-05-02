export type User = {
    id: string;
    email: string;
    role: string;
};

export type LoginResponse = {
    success: boolean;
    message: string;
    accessToken: string;
    user: User;
};

export type LogoutResponse = {
    success: boolean;
    message: string;
};

export type UserProfileResponse = {
    success: boolean;
    data: UserProfile;
};
export type UserProfile = {
    username: string;
    photo: string | null;
    name: string;
    email: string;
    provider: string;
};

export type Mode = 'login' | 'register';
