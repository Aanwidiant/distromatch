import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Pencil } from 'lucide-react';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import Fetch from '@/lib/fetch';
import { toast } from 'sonner';
import { User } from '../page';
import ProfilePicture from '@/components/globals/profile-picture';

type FormState = {
    status: string;
    role: string;
};

const initialState: FormState = {
    role: 'USER',
    status: 'INACTIVE',
};

type UpdateSettingProps = {
    user: User;
    onUpdated?: () => void;
};

export default function UpdateUser({ user, onUpdated }: UpdateSettingProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState<FormState>(initialState);

    const update = (key: keyof FormState, value: string) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const handleOpenChange = (nextOpen: boolean) => {
        setOpen(nextOpen);

        if (nextOpen) {
            setForm({
                role: user.role,
                status: user.status,
            });
        } else {
            setLoading(false);
        }
    };

    const onSubmit = async () => {
        setLoading(true);
        try {
            const res = await Fetch.PATCH(`/users/${user.id}`, {
                role: form.role,
                status: form.status,
            });

            if (res.success === true) {
                onUpdated?.();
                setOpen(false);
                toast.success(res.message || 'User updated successfully!');
            } else {
                toast.error(res.message);
            }
        } catch {
            toast.error('Failed update user!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button size='icon'>
                    <Pencil />
                </Button>
            </DialogTrigger>
            <DialogContent
                className='w-full md:max-w-md'
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle className='flex items-center gap-2'>
                        <Pencil className='size-5' />
                        Update User
                    </DialogTitle>
                </DialogHeader>
                <div className='flex max-h-[60vh] flex-col gap-3 overflow-y-auto p-1'>
                    <div>
                        <p className='text-muted-foreground text-sm'>User</p>
                        <div className='flex items-center gap-3'>
                            <ProfilePicture username={user.name} image={user.photo} />
                            <span>{user.name}</span>
                        </div>
                    </div>
                    <div className='space-y-1'>
                        <Label>Role</Label>
                        <Select value={form.role} onValueChange={(v) => update('role', v)}>
                            <SelectTrigger className='w-full'>
                                <SelectValue placeholder='Role' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='USER'>USER</SelectItem>
                                <SelectItem value='ADMIN'>ADMIN</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className='space-y-1'>
                        <Label>Status</Label>
                        <Select value={form.status} onValueChange={(v) => update('status', v)}>
                            <SelectTrigger className='w-full'>
                                <SelectValue placeholder='Status' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='ACTIVE'>ACTIVE</SelectItem>
                                <SelectItem value='INACTIVE'>INACTIVE</SelectItem>
                                <SelectItem value='SUSPENDED'>SUSPENDED</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant='outline' onClick={() => setOpen(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={onSubmit} disabled={loading}>
                        {loading ? 'Updating...' : 'Update'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
