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

export default function ChangeEmail() {
    const { isOpen, close, closeAll } = useDialog('changeEmail');
    const [newEmail, setNewEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(newEmail);

    const handleChangeEmail = async () => {
        if (!newEmail) {
            toast.error('New email is required.');
            return;
        }

        if (!isValidEmail) {
            toast.error('Please enter a valid email address.');
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
            toast.error('Failed to request email change.');
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
                        Change Email
                    </DialogTitle>
                </DialogHeader>
                <div className='space-y-4'>
                    <p className='text-sm text-gray-600'>
                        Enter your new email address. We will send a verification link to confirm
                        the change.
                    </p>
                    <Input
                        type='email'
                        placeholder='Enter your new email'
                        value={newEmail}
                        className={!isValidEmail && newEmail ? 'error-input' : ''}
                        onChange={(e) => setNewEmail(e.target.value)}
                    />
                </div>
                <DialogFooter>
                    <Button variant='outline' onClick={() => close()}>
                        Cancel
                    </Button>
                    <Button onClick={handleChangeEmail} disabled={loading || !isValidEmail}>
                        {loading ? 'Sending request...' : 'Send Verification Email'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
