import Fetch from '@/lib/fetch';
import { useAuthStore } from '@/stores/auth-store';

export const initAuth = async () => {
    try {
        const data = await Fetch.POST<{
            accessToken: string;
            user: {
                id: string;
                email: string;
                role: string;
            };
        }>('/auth/token/refresh');

        useAuthStore.getState().login({
            accessToken: data.accessToken,
            user: data.user,
        });
    } catch {
        // silent (user memang belum login)
    }
};
