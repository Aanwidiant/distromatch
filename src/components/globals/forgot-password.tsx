'use client';

import { useState } from 'react';
import Fetch from '@/lib/fetch';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
    DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Mail } from 'lucide-react';

export default function ForgotPasswordDialog() {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(email);

    const resetForm = () => {
        setEmail('');
    };

    const handleClose = () => {
        setOpen(false);
        resetForm();
    };

    const handleForgotPassword = async () => {
        if (!email) {
            toast.error('Email is required.');
            return;
        }

        if (!isValidEmail) {
            toast.error('Please enter a valid email address.');
            return;
        }

        setLoading(true);

        try {
            const res = await Fetch.POST('/auth/password/forgot', {
                email,
            });

            if (!res.success) {
                toast.error(res.message || 'Failed to send reset link.');
                return;
            }

            toast.success(res.message);
            handleClose();
        } catch {
            toast.error('Failed to request password reset.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant='link'>Forgot password?</Button>
            </DialogTrigger>

            <DialogContent className='w-full md:max-w-md'>
                <DialogHeader>
                    <DialogTitle className='flex items-center gap-2'>
                        <Mail className='size-5' />
                        Forgot Password
                    </DialogTitle>

                    <DialogDescription>
                        Enter your email address and we will send you a password reset link.
                    </DialogDescription>
                </DialogHeader>

                <div className='space-y-4'>
                    <Input
                        type='email'
                        placeholder='Enter your email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        aria-invalid={!isValidEmail && email.length > 0}
                    />

                    {!isValidEmail && email.length > 0 && (
                        <p className='text-destructive text-sm'>
                            Please enter a valid email address.
                        </p>
                    )}
                </div>

                <DialogFooter>
                    <Button variant='outline' onClick={handleClose} disabled={loading}>
                        Cancel
                    </Button>

                    <Button onClick={handleForgotPassword} disabled={loading || !isValidEmail}>
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
