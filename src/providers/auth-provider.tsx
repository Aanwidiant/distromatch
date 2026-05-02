'use client';

import { useEffect, useState } from 'react';
import { initAuth } from '@/lib/auth-init';
import { useAuthStore } from '@/stores/auth-store';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [initialized, setInitialized] = useState(false);
    const hydrateProfile = useAuthStore((s) => s.hydrateProfile);

    useEffect(() => {
        const init = async () => {
            hydrateProfile();
            await initAuth();
            setInitialized(true);
        };

        init();
    }, [hydrateProfile]);

    if (!initialized) {
        return null;
    }

    return <>{children}</>;
}
