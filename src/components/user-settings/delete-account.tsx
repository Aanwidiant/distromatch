'use client';

import { useState } from 'react';
import Fetch from '@/lib/fetch';
import { Trash } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useAuthStore } from '@/stores/auth-store';
import { useDialog } from '@/hooks/use-dialog';
import { useTranslations } from 'next-intl';

export default function ConfirmDeleteAccount() {
    const { isOpen, close, closeAll } = useDialog('deleteAccount');
    const t = useTranslations('common.deleteAccount');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const { logout } = useAuthStore();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const isValidEmail = emailRegex.test(email);

    const handleDeleteAccount = async () => {
        if (!email) {
            toast.error(t('validation.emailRequired'));
            return;
        }

        if (!emailRegex.test(email)) {
            toast.error(t('validation.emailInvalid'));
            return;
        }

        setLoading(true);
        try {
            const res = await Fetch.DELETE(`/auth/account`, { email });

            if (res.success) {
                toast.success(res.message);
                logout();
                closeAll();
            } else {
                toast.error(res.message);
            }
        } catch {
            toast.error(t('notifications.failed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
            <DialogContent className='w-full max-w-md md:max-w-md'>
                <DialogHeader>
                    <DialogTitle className='text-red flex items-center gap-2'>
                        <Trash className='size-6' />
                        {t('title')}
                    </DialogTitle>
                </DialogHeader>
                <div className='space-y-4'>
                    <p className='text-sm text-gray-600'>{t('description')}</p>
                    <Input
                        type='email'
                        placeholder={t('placeholder')}
                        value={email}
                        className={!isValidEmail && email ? 'error-input' : ''}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <DialogFooter>
                    <Button variant='outline' onClick={() => close()}>
                        {t('buttons.cancel')}
                    </Button>
                    <Button
                        variant='destructive'
                        onClick={handleDeleteAccount}
                        disabled={loading || !isValidEmail}
                    >
                        {loading ? t('buttons.deleting') : t('buttons.delete')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
