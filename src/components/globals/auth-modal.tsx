'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useAuthStore } from '@/stores/auth-store';
import Fetch from '@/lib/fetch';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { AxiosError } from 'axios';
import { LoginResponse, Mode, UserProfile } from '@/types';
import { useGoogleLogin } from '@react-oauth/google';
import { Google } from '../icons';
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group';
import { Eye, EyeOff } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { useTranslations } from 'next-intl';

interface AuthDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: Mode;
    setMode: (mode: Mode) => void;
}

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AuthDialog({ open, onOpenChange, mode, setMode }: AuthDialogProps) {
    const { login, setProfile } = useAuthStore();
    const t = useTranslations('common.auth');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitAttempted, setIsSubmitAttempted] = useState(false);
    const closeModal = () => onOpenChange(false);

    const [loading, setLoading] = useState(false);

    const showPasswordRuleError =
        mode === 'register' &&
        isSubmitAttempted &&
        password.length > 0 &&
        !PASSWORD_REGEX.test(password);
    const showEmailRuleError =
        mode === 'register' && isSubmitAttempted && email.length > 0 && !EMAIL_REGEX.test(email);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitAttempted(true);

        if (mode === 'login') {
            await handleLogin();
        } else {
            await handleRegister();
        }
    };

    const handleLogin = async () => {
        if (!email || !password) {
            toast.error(t('requiredEmailPassword'));
            return;
        }

        setLoading(true);

        try {
            const data = await Fetch.POST<LoginResponse>('/auth/login', {
                email,
                password,
            });

            if (!data.success) {
                toast.error(data.message || t('loginFailed'));
                return;
            }

            login(data.user);

            const me = await Fetch.GET<UserProfile>('/users');

            if (me.success) {
                setProfile({
                    username: me.data.username,
                    photo: me.data.photo,
                    name: me.data.name,
                    provider: me.data.provider,
                    email: me.data.email,
                });
            }

            toast.success(data.message);
            resetForm();
        } catch (err: unknown) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        if (!email || !password || !name) {
            toast.error(t('requiredAllFields'));
            return;
        }

        setLoading(true);

        try {
            const data = await Fetch.POST<{
                success: boolean;
                message: string;
            }>('/auth/register', {
                email,
                password,
                name,
            });

            if (!data.success) {
                toast.error(data.message || t('registerFailed'));
                return;
            }

            toast.success(data.message);
            setMode('login');
            setPassword('');
            setIsSubmitAttempted(false);
        } catch (err: unknown) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    };

    const handleError = (err: unknown) => {
        let message = t('unknownError');

        if (err instanceof AxiosError) {
            const data = err.response?.data as { message?: string } | undefined;
            message = data?.message ?? err.message;
        } else if (err instanceof Error) {
            message = err.message;
        }

        toast.error(message);
    };

    const resetForm = () => {
        onOpenChange(false);
        setEmail('');
        setPassword('');
        setName('');
        setMode('login');
        setIsSubmitAttempted(false);
    };

    const loginGoogle = useGoogleLogin({
        onSuccess: async (codeResponse) => {
            try {
                setLoading(true);

                const response = await Fetch.POST('/auth/login/google', {
                    token: codeResponse.access_token,
                });

                if (!response.success) {
                    toast.error(response.message);
                    return;
                }

                login(response.user);

                const me = await Fetch.GET<UserProfile>('/users');

                if (me.success) {
                    setProfile({
                        username: me.data.username,
                        photo: me.data.photo,
                        name: me.data.name,
                        provider: me.data.provider,
                        email: me.data.email,
                    });
                }

                toast.success(response.message);
                resetForm();
            } catch (err: unknown) {
                handleError(err);
            } finally {
                setLoading(false);
            }
        },
        onError: () => {
            toast.error(t('googleLoginFailed'));
        },
    });

    const isLogin = mode === 'login';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='sm:max-w-3xl'>
                <div className='grid gap-6 md:grid-cols-2'>
                    {!isLogin && (
                        <div className='bg-accent-1 text-secondary hidden items-center justify-center rounded-xl p-6 text-sm md:flex'>
                            Ilustration placeholder
                        </div>
                    )}
                    <div className='space-y-5'>
                        <DialogHeader>
                            <DialogTitle className='text-lg font-semibold'>
                                {isLogin ? 'Sign in' : 'Sign up'}
                            </DialogTitle>
                            <DialogDescription className='text-grey-2 text-sm'>
                                {isLogin ? t('signInDesc') : t('signUpDesc')}
                            </DialogDescription>
                        </DialogHeader>
                        {isLogin && (
                            <>
                                <Button
                                    variant='outline'
                                    onClick={() => loginGoogle()}
                                    disabled={loading}
                                    className='w-full'
                                >
                                    <Google className='size-5' />
                                    {loading ? t('loading') : t('signInWithGoogle')}
                                </Button>

                                <div className='flex items-center gap-3'>
                                    <span className='bg-stroke h-px w-full' />
                                    <span className='text-grey-2 text-xs whitespace-nowrap'>
                                        {t('orSignInWithEmail')}
                                    </span>
                                    <span className='bg-stroke h-px w-full' />
                                </div>
                            </>
                        )}
                        <form onSubmit={handleSubmit} className='space-y-4'>
                            {mode === 'register' && (
                                <Input
                                    placeholder={t('name')}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            )}
                            <Input
                                type='email'
                                placeholder={t('email')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                aria-invalid={showEmailRuleError}
                            />
                            {showEmailRuleError && (
                                <p className='text-destructive text-sm'>{t('invalidEmail')}</p>
                            )}
                            <InputGroup>
                                <InputGroupInput
                                    placeholder={t('password')}
                                    type={showPassword ? 'text' : 'password'}
                                    id='password'
                                    name='password'
                                    value={password}
                                    autoComplete='password'
                                    onChange={(e) => setPassword(e.target.value)}
                                    aria-invalid={showPasswordRuleError}
                                />
                                <InputGroupAddon align='inline-end' className='pr-4'>
                                    <button
                                        type='button'
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={
                                            showPassword ? t('hidePassword') : t('showPassword')
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff className='hover:stroke-primary size-5' />
                                        ) : (
                                            <Eye className='hover:stroke-primary size-5' />
                                        )}
                                    </button>
                                </InputGroupAddon>
                            </InputGroup>
                            {showPasswordRuleError && (
                                <p className='text-destructive text-sm'>{t('invalidPassword')}</p>
                            )}
                            <Button type='submit' disabled={loading} className='w-full'>
                                {loading ? t('loading') : isLogin ? t('signIn') : t('signUp')}
                            </Button>
                            <p className='text-grey-2 text-xs'>
                                {t('prefix')}{' '}
                                <Link
                                    href='/privacy-policy'
                                    className='text-primary'
                                    onClick={closeModal}
                                >
                                    {t('privacyPolicy')}
                                </Link>{' '}
                                {t('and')}{' '}
                                <Link
                                    href='/terms-conditions'
                                    className='text-primary'
                                    onClick={closeModal}
                                >
                                    {t('termsConditions')}
                                </Link>
                                .
                            </p>
                        </form>
                        <p className='text-center text-sm'>
                            {isLogin ? t('dontHaveAccount') : t('alreadyHaveAccount')}{' '}
                            <button
                                type='button'
                                onClick={() => {
                                    setMode(isLogin ? 'register' : 'login');
                                    setIsSubmitAttempted(false);
                                }}
                                className='text-primary font-medium'
                            >
                                {isLogin ? t('signUp') : t('signIn')}
                            </button>
                        </p>
                    </div>
                    {isLogin && (
                        <div className='bg-accent-1 text-secondary hidden items-center justify-center rounded-xl p-6 text-sm md:flex'>
                            Ilustration placeholder
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
