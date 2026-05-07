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
import { useLocale } from 'next-intl';
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

    const handleDelete = async () => {
        setLoading(true);

        try {
            const res = await Fetch.DELETE(`/dss/${id}`);

            if (res.success) {
                toast.success(res.message);

                setOpen(false);

                onDeleted?.();
            } else {
                toast.error(res.message || 'Failed to delete dss run result');
            }
        } catch {
            toast.error('Something went wrong');
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
                        Delete DSS Result?
                    </DialogTitle>
                </DialogHeader>
                <div className='space-y-3 text-sm'>
                    <p>Are you sure you want to delete this DSS result?</p>
                    <div className='space-y-1'>
                        <p>
                            <span className='font-medium'>ID:</span>{' '}
                            <span className='font-mono'>{id}</span>
                        </p>
                        <p>
                            <span className='font-medium'>Created at:</span>{' '}
                            <span className='font-medium'>{formatDateTime(createdAt, locale)}</span>
                        </p>
                    </div>
                    <p className='text-red'>This action cannot be undone.</p>
                </div>
                <DialogFooter>
                    <Button variant='outline' onClick={() => setOpen(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button variant='destructive' onClick={handleDelete} disabled={loading}>
                        {loading ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
