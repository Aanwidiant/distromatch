'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SuccessVerify from '@/components/globals/success-verify';
import FailedVerify from '@/components/globals/failed-verify';
import Fetch from '@/lib/fetch';

const VERIFY_CONFIG = {
    email: {
        getEndpoint: (token: string) => `/auth/email/verify?token=${token}`,
        loadingMessage: 'Verifying email...',
        successTitle: 'Email verified!',
        successDescription: 'Your email has been verified successfully.',
        failureTitle: 'Email verification failed',
        failureFallback: 'We could not verify your email. The link may be invalid or expired.',
        redirectPath: '/',
    },
    'change-email': {
        getEndpoint: (token: string) => `/auth/email/change/verify?token=${token}`,
        loadingMessage: 'Verifying email change...',
        successTitle: 'Email updated!',
        successDescription: 'Your email change has been confirmed successfully.',
        failureTitle: 'Email change verification failed',
        failureFallback:
            'We could not confirm your email change. The link may be invalid or expired.',
        redirectPath: '/',
    },
} as const;

type VerifyType = keyof typeof VERIFY_CONFIG;

export default function EmailVerify() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const token = searchParams.get('token');
    const typeParam = searchParams.get('type');

    const verifyType =
        typeParam === 'email' || typeParam === 'change-email' ? (typeParam as VerifyType) : null;
    const config = verifyType ? VERIFY_CONFIG[verifyType] : null;

    const hasValidParams = Boolean(token && config);

    const [loading, setLoading] = useState(hasValidParams);
    const [verified, setVerified] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [countdown, setCountdown] = useState(5);
    const [redirectPath, setRedirectPath] = useState<string | null>(null);

    useEffect(() => {
        if (!hasValidParams || !token || !config) return;

        const verify = async () => {
            try {
                const res = await Fetch.GET(config.getEndpoint(token));

                if (res?.success) {
                    setRedirectPath(config.redirectPath);
                    setVerified(true);
                } else {
                    setErrorMessage(res?.message || config.failureFallback);
                }
            } catch {
                setErrorMessage(config.failureFallback);
            } finally {
                setLoading(false);
            }
        };

        verify();
    }, [hasValidParams, token, config]);

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

    const displayErrorMessage = hasValidParams
        ? errorMessage || config?.failureFallback || 'Verification failed.'
        : 'Invalid or broken verification link.';

    return (
        <div className='flex h-screen flex-col items-center justify-center'>
            {loading && <p className='animate-pulse'>{config?.loadingMessage || 'Verifying...'}</p>}

            {!loading && verified && config && (
                <SuccessVerify
                    onContinue={handleContinue}
                    countdown={countdown}
                    title={config.successTitle}
                    description={config.successDescription}
                    buttonLabel='Continue to Home'
                />
            )}

            {!loading && !verified && (
                <FailedVerify
                    onContinue={() => router.replace('/')}
                    title={config?.failureTitle || 'Verification Failed'}
                    description={displayErrorMessage}
                    buttonLabel='Go to Home'
                />
            )}
        </div>
    );
}
