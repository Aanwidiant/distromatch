'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Trash } from 'lucide-react';
import { Button } from '../ui/button';
import { useState } from 'react';
import Fetch from '@/lib/fetch';
import { toast } from 'sonner';
import { useLocale, useTranslations } from 'next-intl';
import { formatDateTime } from '@/lib/formate-date';

interface ConfirmDeleteResultProps {
    id: string;
    createdAt: string | Date;
    onDeleted?: () => void;
}

export default function ConfirmDeleteResult({
    id,
    createdAt,
    onDeleted,
}: ConfirmDeleteResultProps) {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const locale = useLocale();
    const t = useTranslations('result.deleteResult');

    const handleDelete = async () => {
        setLoading(true);

        try {
            const res = await Fetch.DELETE(`/dss/${id}`);

            if (res.success) {
                toast.success(res.message);

                setOpen(false);

                onDeleted?.();
            } else {
                toast.error(res.message || t('errors.failed'));
            }
        } catch {
            toast.error(t('errors.unknown'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant='destructive' size='icon'>
                    <Trash />
                </Button>
            </DialogTrigger>
            <DialogContent className='w-full max-w-md md:max-w-md'>
                <DialogHeader>
                    <DialogTitle className='text-red flex items-center gap-2'>
                        <Trash className='size-5' />
                        {t('title')}
                    </DialogTitle>
                </DialogHeader>
                <div className='space-y-3 text-sm'>
                    <p>{t('description')}</p>
                    <div className='space-y-1'>
                        <p>
                            <span className='font-medium'>{t('idLabel')}:</span>{' '}
                            <span className='font-mono'>{id}</span>
                        </p>
                        <p>
                            <span className='font-medium'>{t('createdAtLabel')}:</span>{' '}
                            <span className='font-medium'>{formatDateTime(createdAt, locale)}</span>
                        </p>
                    </div>
                    <p className='text-red'>{t('warning')}</p>
                </div>
                <DialogFooter>
                    <Button variant='outline' onClick={() => setOpen(false)} disabled={loading}>
                        {t('buttons.cancel')}
                    </Button>
                    <Button variant='destructive' onClick={handleDelete} disabled={loading}>
                        {loading ? t('buttons.loading') : t('buttons.confirm')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
