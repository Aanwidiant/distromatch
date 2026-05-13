'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Trash } from 'lucide-react';
import { Button } from '../ui/button';
import { useState } from 'react';
import Fetch from '@/lib/fetch';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/auth-store';
import { useDialog } from '@/hooks/use-dialog';
import { useTranslations } from 'next-intl';

export default function ConfirmDeletePhoto() {
    const { isOpen, close } = useDialog('deletePhoto');
    const [loading, setLoading] = useState(false);
    const t = useTranslations('common.deletePhoto');

    const updateProfile = useAuthStore((s) => s.updateProfile);

    const handleDelete = async () => {
        setLoading(true);

        try {
            const res = await Fetch.DELETE('/users');

            if (res.success) {
                toast.success(res.message || t('notifications.success'));
                updateProfile({ photo: null });
                close();
            } else {
                toast.error(res.message || t('notifications.failed'));
            }
        } catch {
            toast.error(t('notifications.error'));
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
                <p className='text-sm'>{t('description')}</p>
                <DialogFooter>
                    <Button variant='outline' onClick={() => close()}>
                        {t('buttons.cancel')}
                    </Button>
                    <Button variant='destructive' onClick={handleDelete} disabled={loading}>
                        {loading ? t('buttons.deleting') : t('buttons.delete')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
