'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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

interface AuthDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: Mode;
    setMode: (mode: Mode) => void;
}

export default function AuthDialog({ open, onOpenChange, mode, setMode }: AuthDialogProps) {
    const { login, setProfile } = useAuthStore();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (mode === 'login') {
            await handleLogin();
        } else {
            await handleRegister();
        }
    };

    const handleLogin = async () => {
        if (!email || !password) {
            toast.error('Email dan password wajib diisi');
            return;
        }

        setLoading(true);

        try {
            const data = await Fetch.POST<LoginResponse>('/auth/login', {
                email,
                password,
            });

            if (!data.success) {
                toast.error(data.message || 'Login gagal');
                return;
            }

            login({
                accessToken: data.accessToken,
                user: data.user,
            });

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

            toast.success('Login berhasil 🎉');
            resetForm();
        } catch (err: unknown) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        if (!email || !password || !name) {
            toast.error('Semua field wajib diisi');
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
                toast.error(data.message || 'Register gagal');
                return;
            }

            toast.success(data.message);
            setMode('login');
            setPassword('');
        } catch (err: unknown) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    };

    const handleError = (err: unknown) => {
        let message = 'Terjadi kesalahan';

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

                login({
                    accessToken: response.accessToken,
                    user: response.user,
                });

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
            } catch (err: unknown) {
                handleError(err);
            } finally {
                setLoading(false);
            }
        },
        onError: () => {
            toast.error('Google login failed');
        },
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='sm:max-w-md'>
                <DialogHeader>
                    <DialogTitle>{mode === 'login' ? 'Login' : 'Register'}</DialogTitle>{' '}
                </DialogHeader>

                {mode === 'login' && (
                    <Button variant='outline' onClick={() => loginGoogle()} disabled={loading}>
                        <Google className='size-5' />
                        {loading ? 'Loading...' : 'Login with Google'}
                    </Button>
                )}
                <form onSubmit={handleSubmit} className='space-y-4'>
                    {mode === 'register' && (
                        <Input
                            placeholder='Name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    )}
                    <Input
                        type='email'
                        placeholder='Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <InputGroup>
                        <InputGroupInput
                            placeholder='Password'
                            type={showPassword ? 'text' : 'password'}
                            id='password'
                            name='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <InputGroupAddon align='inline-end' className='pr-4'>
                            <button
                                type='button'
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? (
                                    <EyeOff className='hover:stroke-primary size-5' />
                                ) : (
                                    <Eye className='hover:stroke-primary size-5' />
                                )}
                            </button>
                        </InputGroupAddon>
                    </InputGroup>
                    <Button type='submit' disabled={loading} className='w-full'>
                        {loading ? 'Loading...' : mode === 'login' ? 'Login' : 'Register'}
                    </Button>
                </form>
                <p className='text-muted-foreground text-center text-sm'>
                    {mode === 'login' ? 'Belum punya akun?' : 'Sudah punya akun?'}{' '}
                    <button
                        type='button'
                        onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                        className='text-primary font-medium'
                    >
                        {mode === 'login' ? 'Register' : 'Login'}
                    </button>
                </p>
            </DialogContent>
        </Dialog>
    );
}
