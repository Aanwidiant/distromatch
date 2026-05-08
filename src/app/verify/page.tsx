'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import SuccessVerify from '@/components/globals/success-verify';
import Fetch from '@/lib/fetch';

export default function EmailVerify() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const token = searchParams.get('token');

    const [loading, setLoading] = useState(!!token);
    const [verified, setVerified] = useState(false);
    const [message, setMessage] = useState(
        token ? 'Verifying email...' : 'Invalid or broken verification link'
    );
    const [countdown, setCountdown] = useState(5);
    const [redirectPath, setRedirectPath] = useState<string | null>(null);

    // 🔹 Verify email
    useEffect(() => {
        if (!token) return;

        const verify = async () => {
            try {
                const res = await Fetch.GET(`/auth/verify-email?token=${token}`);

                if (res?.success) {
                    setRedirectPath('/');
                    setVerified(true);
                } else {
                    setMessage(res?.message || 'Verification failed');
                }
            } catch {
                setMessage('Something went wrong. Link might be expired.');
            } finally {
                setLoading(false);
            }
        };

        verify();
    }, [token]);

    // 🔹 Countdown redirect
    useEffect(() => {
        if (!verified || !redirectPath) return;

        if (countdown === 0) {
            router.replace(redirectPath);
            return;
        }

        const timer = setTimeout(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [verified, countdown, redirectPath, router]);

    const handleContinue = () => {
        if (redirectPath) {
            router.replace(redirectPath);
        }
    };

    return (
        <div className='flex h-screen flex-col items-center justify-center'>
            {loading && (
                <>
                    <p className='animate-pulse'>Verifying email...</p>
                </>
            )}

            {!loading && verified && (
                <SuccessVerify onContinue={handleContinue} countdown={countdown} />
            )}

            {!loading && !verified && (
                <div className='flex flex-col items-center gap-4'>
                    <p className='text-center text-lg'>{message}</p>
                    <Button onClick={() => router.replace('/')}>Go to Home</Button>
                </div>
            )}
        </div>
    );
}
