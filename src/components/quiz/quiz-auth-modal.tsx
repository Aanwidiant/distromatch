'use client';

import AuthDialog from '@/components/globals/auth-modal';
import { useAuthStore } from '@/stores/auth-store';
import { useQuizStore } from '@/stores/quiz-store';
import { useRouter } from 'next/navigation';

export default function QuizAuthModal() {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const { authOpen, authMode, authRedirectTo, setAuthOpen, setAuthMode, setAuthRedirectTo } =
        useQuizStore();

    const handleAuthOpenChange = (open: boolean) => {
        setAuthOpen(open);
        if (!open && isAuthenticated && authRedirectTo) {
            const redirect = authRedirectTo;
            setAuthRedirectTo(null);
            router.push(redirect);
        }
    };

    return (
        <AuthDialog
            open={authOpen}
            onOpenChange={handleAuthOpenChange}
            mode={authMode}
            setMode={setAuthMode}
        />
    );
}
