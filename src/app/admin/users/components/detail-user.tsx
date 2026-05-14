import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Eye } from 'lucide-react';
import { formatDateTime } from '@/lib/formate-date';
import ProfilePicture from '@/components/globals/profile-picture';
import { User } from '../page';

type DetailUserProps = {
    user: User;
};

export default function DetailUser({ user }: DetailUserProps) {
    const [open, setOpen] = useState(false);
    const [data, setData] = useState<User | null>(null);

    const handleOpenChange = (nextOpen: boolean) => {
        setOpen(nextOpen);
        if (nextOpen) {
            setData(user);
        } else {
            setData(null);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button size='icon'>
                    <Eye />
                </Button>
            </DialogTrigger>
            <DialogContent className='w-full md:max-w-xl'>
                <DialogHeader>
                    <DialogTitle className='flex items-center gap-2'>
                        <Eye className='size-5' />
                        Detail User
                    </DialogTitle>
                </DialogHeader>

                {!data ? (
                    <div className='text-muted-foreground py-10 text-center text-sm'>No data</div>
                ) : (
                    <div className='space-y-6'>
                        <div className='grid max-h-[60vh] gap-4 overflow-y-auto p-1 sm:grid-cols-2'>
                            <div className='sm:col-span-2'>
                                <p className='text-muted-foreground text-sm'>
                                    Name & Photo Profile
                                </p>
                                <div className='flex items-center gap-3'>
                                    <ProfilePicture username={data.name} image={data.photo} />
                                    <span>{data.name}</span>
                                </div>
                            </div>
                            <div>
                                <p className='text-muted-foreground text-sm'>Username</p>
                                <p className='font-medium break-all'>{data.username || '-'}</p>
                            </div>
                            <div>
                                <p className='text-muted-foreground text-sm'>Email</p>
                                <p className='font-medium break-all'>{data.email || '-'}</p>
                            </div>
                            <div>
                                <p className='text-muted-foreground text-sm'>Role</p>
                                <p className='font-medium'>{data.role || '-'}</p>
                            </div>
                            <div>
                                <p className='text-muted-foreground text-sm'>Status</p>
                                <p className='font-medium'>{data.status ?? '-'}</p>
                            </div>
                            <div>
                                <p className='text-muted-foreground text-sm'>Email Verified</p>
                                <p className='font-medium'>
                                    {data.email_verified ? 'Verified' : 'Not Verified'}
                                </p>
                            </div>
                            <div>
                                <p className='text-muted-foreground text-sm'>Provider</p>
                                <p className='font-medium'>{data.provider ?? '-'}</p>
                            </div>
                            <div>
                                <p className='text-muted-foreground text-sm'>Created At</p>
                                <p className='font-medium'>
                                    {formatDateTime(data.created_at) ?? '-'}
                                </p>
                            </div>
                            <div>
                                <p className='text-muted-foreground text-sm'>Updated At</p>
                                <p className='font-medium'>
                                    {formatDateTime(data.updated_at) ?? '-'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
