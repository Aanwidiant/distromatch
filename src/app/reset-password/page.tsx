'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Fetch from '@/lib/fetch';
import { toast } from 'sonner';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null);

    const showPasswordRuleError = newPassword.length > 0 && !PASSWORD_REGEX.test(newPassword);
    const showConfirmMismatchError = confirmPassword.length > 0 && newPassword !== confirmPassword;

    useEffect(() => {
        if (redirectCountdown === null) return;

        if (redirectCountdown === 0) {
            router.push('/');
            return;
        }

        const timer = setTimeout(() => {
            setRedirectCountdown((prev) => (prev === null ? prev : prev - 1));
        }, 1000);

        return () => clearTimeout(timer);
    }, [redirectCountdown, router]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage('');

        if (!token) {
            toast.error('Invalid or missing reset token.');
            return;
        }

        if (!PASSWORD_REGEX.test(newPassword)) {
            return;
        }

        if (newPassword !== confirmPassword) {
            return;
        }

        try {
            setLoading(true);
            const res = await Fetch.POST('/auth/password/reset', {
                token,
                password: newPassword,
            });

            if (res?.success) {
                toast.success('Password reset successful. Redirecting to home...');
                setNewPassword('');
                setConfirmPassword('');
                setRedirectCountdown(5);
            } else {
                toast.error(res?.message || 'Password reset failed. Please try again.');
            }
        } catch {
            toast.error('Password reset failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className='bg-background flex min-h-screen items-center justify-center px-6 py-12'>
            <div className='border-stroke bg-bg-2 mx-auto w-full max-w-5xl rounded-2xl p-6 shadow-sm md:p-8'>
                <div className='grid gap-8 md:grid-cols-[minmax(0,420px)_1fr] md:items-center'>
                    <div>
                        <div className='mb-6 space-y-2'>
                            <h1 className='text-2xl font-semibold'>Reset your password</h1>
                            <p className='text-grey-3 text-sm'>
                                Enter a strong new password for your account.
                            </p>
                        </div>

                        <form className='space-y-6' onSubmit={handleSubmit}>
                            <div className='space-y-2'>
                                <Label htmlFor='new-password'>New password</Label>
                                <Input
                                    id='new-password'
                                    type='password'
                                    value={newPassword}
                                    onChange={(event) => setNewPassword(event.target.value)}
                                    placeholder='Enter your new password'
                                    autoComplete='new-password'
                                    required
                                    aria-invalid={showPasswordRuleError}
                                />
                                {showPasswordRuleError && (
                                    <p className='text-destructive text-sm'>
                                        Must be at least 8 characters and include uppercase,
                                        lowercase, number, and special character.
                                    </p>
                                )}
                            </div>

                            <div className='space-y-2'>
                                <Label htmlFor='confirm-password'>Confirm new password</Label>
                                <Input
                                    id='confirm-password'
                                    type='password'
                                    value={confirmPassword}
                                    onChange={(event) => setConfirmPassword(event.target.value)}
                                    placeholder='Re-enter your new password'
                                    autoComplete='new-password'
                                    required
                                    aria-invalid={showConfirmMismatchError}
                                />
                                {showConfirmMismatchError && (
                                    <p className='text-destructive text-sm'>
                                        Passwords do not match.
                                    </p>
                                )}
                            </div>

                            {errorMessage && (
                                <p className='text-destructive text-sm'>{errorMessage}</p>
                            )}

                            {redirectCountdown !== null && (
                                <p className='text-grey-3 text-sm'>
                                    Redirecting in{' '}
                                    <span className='font-semibold'>{redirectCountdown}</span>{' '}
                                    seconds...
                                </p>
                            )}

                            <div className='flex flex-col gap-3 sm:flex-row'>
                                <Button type='submit' disabled={loading} className='sm:w-auto'>
                                    {loading ? 'Resetting...' : 'Reset password'}
                                </Button>
                                <Button
                                    type='button'
                                    variant='outline'
                                    onClick={() => router.replace('/')}
                                >
                                    Back to Home
                                </Button>
                            </div>
                        </form>
                    </div>

                    <div className='border-border bg-muted/40 hidden h-105 w-full items-center justify-center rounded-2xl border border-dashed md:flex'>
                        <p className='text-grey-3 text-sm'>Image placeholder</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
