'use client';

import { useState } from 'react';
import Fetch from '@/lib/fetch';
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
import { Mail } from 'lucide-react';
import { useDialog } from '@/hooks/use-dialog';
import { useTranslations } from 'next-intl';

export default function ChangeEmail() {
    const { isOpen, close, closeAll } = useDialog('changeEmail');
    const t = useTranslations('common.changeEmail');
    const [newEmail, setNewEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(newEmail);

    const handleChangeEmail = async () => {
        if (!newEmail) {
            toast.error(t('validation.emailRequired'));
            return;
        }

        if (!isValidEmail) {
            toast.error(t('validation.emailInvalid'));
            return;
        }

        setLoading(true);

        try {
            const res = await Fetch.POST('/auth/email/change', {
                newEmail,
            });

            if (res.success) {
                toast.success(res.message);
                setNewEmail('');
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
                    <DialogTitle className='flex items-center gap-2'>
                        <Mail className='size-6' />
                        {t('title')}
                    </DialogTitle>
                </DialogHeader>
                <div className='space-y-4'>
                    <p className='text-grey-2 text-sm'>{t('description')}</p>
                    <Input
                        type='email'
                        placeholder={t('placeholder')}
                        value={newEmail}
                        className={!isValidEmail && newEmail ? 'error-input' : ''}
                        onChange={(e) => setNewEmail(e.target.value)}
                    />
                </div>
                <DialogFooter>
                    <Button variant='outline' onClick={() => close()}>
                        {t('buttons.cancel')}
                    </Button>
                    <Button onClick={handleChangeEmail} disabled={loading || !isValidEmail}>
                        {loading ? t('buttons.sending') : t('buttons.sendVerification')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
