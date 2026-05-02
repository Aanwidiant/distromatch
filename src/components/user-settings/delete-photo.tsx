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

export default function ConfirmDeletePhoto() {
    const { isOpen, close } = useDialog('deletePhoto');
    const [loading, setLoading] = useState(false);

    const updateProfile = useAuthStore((s) => s.updateProfile);

    const handleDelete = async () => {
        setLoading(true);

        try {
            const res = await Fetch.DELETE('/users');

            if (res.success) {
                toast.success(res.message || 'Profile photo deleted');
                updateProfile({ photo: null });
                close();
            } else {
                toast.error(res.message || 'Failed to delete photo');
            }
        } catch {
            toast.error('Something went wrong');
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
                        Delete Profile Picture?
                    </DialogTitle>
                </DialogHeader>
                <p className='text-muted-foreground text-sm'>
                    Are you sure you want to delete your profile picture? This action cannot be
                    undone.
                </p>
                <DialogFooter>
                    <Button variant='outline' onClick={() => close()}>
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
