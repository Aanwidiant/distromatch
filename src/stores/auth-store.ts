import { User, UserProfile } from '@/types';
import { create } from 'zustand';

type AuthState = {
    isAuthenticated: boolean;
    user: User | null;
    profile: UserProfile | null;

    login: (user: User) => void;
    setProfile: (profile: UserProfile) => void;
    updateProfile: (data: Partial<UserProfile>) => void;
    hydrateProfile: () => void;
    logout: () => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
    isAuthenticated: false,
    user: null,
    profile: null,

    login: (user) => {
        set({
            isAuthenticated: true,
            user,
        });
    },

    setProfile: (profile) => {
        set({ profile });
        localStorage.setItem('user_profile', JSON.stringify(profile));
    },

    updateProfile: (data) => {
        const current = get().profile;

        if (!current) return;

        const updated = {
            ...current,
            ...data,
        };

        set({ profile: updated });
        localStorage.setItem('user_profile', JSON.stringify(updated));
    },

    hydrateProfile: () => {
        try {
            const raw = localStorage.getItem('user_profile');
            if (!raw) return;

            const profile: UserProfile = JSON.parse(raw);
            set({ profile });
        } catch {
            // ignore
        }
    },

    logout: () => {
        set({
            isAuthenticated: false,
            user: null,
            profile: null,
        });

        localStorage.removeItem('user_profile');
    },
}));
