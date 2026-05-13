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
import { useTranslations } from 'next-intl';

export default function ForgotPasswordDialog() {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const t = useTranslations('common.forgotPassword');

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
            toast.error(t('validation.emailRequired'));
            return;
        }

        if (!isValidEmail) {
            toast.error(t('validation.emailInvalid'));
            return;
        }

        setLoading(true);

        try {
            const res = await Fetch.POST('/auth/password/forgot', {
                email,
            });

            if (!res.success) {
                toast.error(res.message || t('notifications.failed'));
                return;
            }

            toast.success(res.message || t('notifications.success'));
            handleClose();
        } catch {
            toast.error(t('notifications.failed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant='link'>{t('title')}?</Button>
            </DialogTrigger>

            <DialogContent className='w-full md:max-w-md'>
                <DialogHeader>
                    <DialogTitle className='flex items-center gap-2'>
                        <Mail className='size-5' />
                        {t('title')}
                    </DialogTitle>

                    <DialogDescription>{t('description')}</DialogDescription>
                </DialogHeader>

                <div className='space-y-4'>
                    <Input
                        type='email'
                        placeholder={t('placeholder')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        aria-invalid={!isValidEmail && email.length > 0}
                    />

                    {!isValidEmail && email.length > 0 && (
                        <p className='text-destructive text-sm'>{t('validation.emailInvalid')}</p>
                    )}
                </div>

                <DialogFooter>
                    <Button variant='outline' onClick={handleClose} disabled={loading}>
                        {t('buttons.cancel')}
                    </Button>

                    <Button onClick={handleForgotPassword} disabled={loading || !isValidEmail}>
                        {loading ? t('buttons.sending') : t('buttons.sendLink')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
