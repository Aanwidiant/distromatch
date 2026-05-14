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

interface ConfirmDeleteProps {
    icon?: React.ReactNode;
    title: string;
    name: string;
    handleDelete: () => Promise<void> | void;
    loading: boolean;
}

export default function ConfirmDelete({
    icon,
    title,
    name,
    handleDelete,
    loading,
}: ConfirmDeleteProps) {
    const [open, setOpen] = useState(false);

    const onDelete = async () => {
        await handleDelete();
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant='destructive' size='icon'>
                    {icon ? icon : <Trash className='size-4' />}
                </Button>
            </DialogTrigger>
            <DialogContent className='w-full md:max-w-md'>
                <DialogHeader>
                    <DialogTitle className='text-destructive flex items-center gap-2'>
                        <Trash className='size-5' />
                        Delete {title}?
                    </DialogTitle>
                </DialogHeader>
                <div className='max-h-[60vh] space-y-3 overflow-y-auto text-sm'>
                    <p>Are you sure you want to delete?</p>
                    <div className='space-y-1'>
                        <p>
                            <span className='font-medium'>Name:</span>{' '}
                            <span className='font-mono'>{name}</span>
                        </p>
                    </div>
                    <p className='text-destructive'>This action cannot be undone.</p>
                </div>
                <DialogFooter>
                    <Button variant='outline' onClick={() => setOpen(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button variant='destructive' onClick={onDelete} disabled={loading}>
                        {loading ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
