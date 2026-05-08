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
import { BadgePlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
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

type FormState = {
    email: string;
    name: string;
    password: string;
    role: string;
};

const initialState: FormState = {
    email: '',
    name: '',
    password: '',
    role: 'USER',
};

type CreateUserProps = {
    onCreated?: () => void;
};

export default function CreateUser({ onCreated }: CreateUserProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState<FormState>(initialState);

    const update = (key: keyof FormState, value: string) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const onSubmit = async () => {
        setLoading(true);
        try {
            const res = await Fetch.POST('/users', {
                email: form.email,
                name: form.name,
                password: form.password,
                role: form.role,
            });

            if (res.success === true) {
                onCreated?.();
                setOpen(false);
                setForm(initialState);
                toast.success(res.message || 'User created successfully!');
            } else {
                toast.error(res.message);
            }
        } catch {
            toast.error('Failed create user!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className='flex w-fit gap-1'>
                    <BadgePlus className='size-4' />
                    <p>Create User</p>
                </Button>
            </DialogTrigger>
            <DialogContent
                className='w-full md:max-w-md'
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle className='flex items-center gap-2'>
                        <BadgePlus className='size-5' />
                        Create User
                    </DialogTitle>
                </DialogHeader>
                <div className='flex flex-col gap-3'>
                    <div className='space-y-1'>
                        <Label>Email</Label>
                        <Input
                            type='text'
                            placeholder='326'
                            value={form.email}
                            onChange={(e) => update('email', e.target.value)}
                        />
                    </div>
                    <div className='space-y-1 md:col-span-2'>
                        <Label>Name</Label>
                        <Input
                            placeholder='Linux Mint'
                            value={form.name}
                            onChange={(e) => update('name', e.target.value)}
                        />
                    </div>
                    <div className='space-y-1'>
                        <Label>Password</Label>
                        <Input
                            type='password'
                            placeholder='326'
                            value={form.password}
                            onChange={(e) => update('password', e.target.value)}
                        />
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
                </div>
                <DialogFooter>
                    <Button variant='outline' onClick={() => setOpen(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={onSubmit} disabled={loading}>
                        {loading ? 'Creating...' : 'Create'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
