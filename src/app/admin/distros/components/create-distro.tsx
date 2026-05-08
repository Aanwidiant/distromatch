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
import { BadgePlus, Clock2Icon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import Fetch from '@/lib/fetch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { toast } from 'sonner';

type FormState = {
    name: string;
    homepage_url: string;
    docs_url: string;
    ux_rating: string;
    performance_rating: string;
    stability_rating: string;
    features_rating: string;
    support_rating: string;
    total_reviews: string;
    target_user_level: string;
    distro_type: string;
    based_on: string;
    origin_country: string;
    architectures: string;
    desktop_environments: string;
    categories: string;
    status: string;
    description: string;
    source_url: string;
    taken_at: string;
};

const initialState: FormState = {
    name: '',
    homepage_url: '',
    docs_url: '',
    ux_rating: '',
    performance_rating: '',
    stability_rating: '',
    features_rating: '',
    support_rating: '',
    total_reviews: '',
    target_user_level: '',
    distro_type: '',
    based_on: '',
    origin_country: '',
    architectures: '',
    desktop_environments: '',
    categories: '',
    status: 'ACTIVE',
    description: '',
    source_url: '',
    taken_at: '',
};

type CreateDistroProps = {
    onCreated?: () => void;
};

const toArray = (value: string) =>
    value
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean);

export default function CreateDistro({ onCreated }: CreateDistroProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState<FormState>(initialState);
    const [takenAtDate, setTakenAtDate] = useState<Date | undefined>();
    const [takenAtTime, setTakenAtTime] = useState('10:00:00');

    const update = (key: keyof FormState, value: string) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const updateTakenAt = (date?: Date, time?: string) => {
        if (!date) {
            update('taken_at', '');
            return;
        }
        const [hh, mm, ss] = (time || '00:00:00').split(':').map(Number);
        const withTime = new Date(date);
        withTime.setHours(hh || 0, mm || 0, ss || 0, 0);
        update('taken_at', withTime.toISOString());
    };

    const onSubmit = async () => {
        setLoading(true);
        try {
            const res = await Fetch.POST('/distros', {
                name: form.name,
                homepage_url: form.homepage_url,
                docs_url: toArray(form.docs_url),
                ux_rating: Number(form.ux_rating),
                performance_rating: Number(form.performance_rating),
                stability_rating: Number(form.stability_rating),
                features_rating: Number(form.features_rating),
                support_rating: Number(form.support_rating),
                total_reviews: Number(form.total_reviews),
                target_user_level: form.target_user_level,
                distro_type: toArray(form.distro_type),
                based_on: toArray(form.based_on),
                origin_country: toArray(form.origin_country),
                architectures: toArray(form.architectures),
                desktop_environments: toArray(form.desktop_environments),
                categories: toArray(form.categories),
                status: form.status,
                description: form.description,
                source_url: toArray(form.source_url),
                taken_at: form.taken_at,
            });

            if (res.success === true) {
                onCreated?.();
                setOpen(false);
                setForm(initialState);
                setTakenAtDate(undefined);
                setTakenAtTime('10:00:00');
                toast.success(res.message || 'Distro created successfully!');
            } else {
                toast.error(res.message);
            }
        } catch {
            toast.error('Failed create distro!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className='flex w-fit gap-1'>
                    <BadgePlus className='size-4' />
                    <p>Create Distro</p>
                </Button>
            </DialogTrigger>
            <DialogContent
                className='w-full md:max-w-4xl'
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle className='flex items-center gap-2'>
                        <BadgePlus className='size-5' />
                        Create Distro
                    </DialogTitle>
                </DialogHeader>
                <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4'>
                    <div className='space-y-1'>
                        <Label>Name</Label>
                        <Input
                            placeholder='Linux Mint'
                            value={form.name}
                            onChange={(e) => update('name', e.target.value)}
                        />
                    </div>

                    <div className='space-y-1'>
                        <Label>Total Reviews</Label>
                        <Input
                            type='number'
                            placeholder='326'
                            value={form.total_reviews}
                            onChange={(e) => update('total_reviews', e.target.value)}
                        />
                    </div>

                    <div className='space-y-1'>
                        <Label>UX Rating</Label>
                        <Input
                            type='number'
                            step='0.1'
                            placeholder='4.7'
                            value={form.ux_rating}
                            onChange={(e) => update('ux_rating', e.target.value)}
                        />
                    </div>

                    <div className='space-y-1'>
                        <Label>Performance Rating</Label>
                        <Input
                            type='number'
                            step='0.1'
                            placeholder='4.2'
                            value={form.performance_rating}
                            onChange={(e) => update('performance_rating', e.target.value)}
                        />
                    </div>

                    <div className='space-y-1'>
                        <Label>Stability Rating</Label>
                        <Input
                            type='number'
                            step='0.1'
                            placeholder='4.6'
                            value={form.stability_rating}
                            onChange={(e) => update('stability_rating', e.target.value)}
                        />
                    </div>

                    <div className='space-y-1'>
                        <Label>Features Rating</Label>
                        <Input
                            type='number'
                            step='0.1'
                            placeholder='4.5'
                            value={form.features_rating}
                            onChange={(e) => update('features_rating', e.target.value)}
                        />
                    </div>

                    <div className='space-y-1'>
                        <Label>Support Rating</Label>
                        <Input
                            type='number'
                            step='0.1'
                            placeholder='4.5'
                            value={form.support_rating}
                            onChange={(e) => update('support_rating', e.target.value)}
                        />
                    </div>

                    <div className='space-y-1'>
                        <Label>Target User Level</Label>
                        <Select
                            value={form.target_user_level}
                            onValueChange={(v) => update('target_user_level', v)}
                        >
                            <SelectTrigger className='w-full'>
                                <SelectValue placeholder='Select level' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='Beginner Friendly'>Beginner</SelectItem>
                                <SelectItem value='Intermediate Experience Required'>
                                    Intermediate
                                </SelectItem>
                                <SelectItem value='Advanced Experience Required'>
                                    Advanced
                                </SelectItem>
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
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='space-y-1'>
                        <Label>Distro Type</Label>
                        <Input
                            placeholder='Linux'
                            value={form.distro_type}
                            onChange={(e) => update('distro_type', e.target.value)}
                        />
                    </div>
                    <div className='space-y-1 sm:col-span-2'>
                        <Label>Based On</Label>
                        <Input
                            placeholder='Debian (Stable), Ubuntu (LTS)'
                            value={form.based_on}
                            onChange={(e) => update('based_on', e.target.value)}
                        />
                    </div>
                    <div className='space-y-1 sm:col-span-2'>
                        <Label>Homepage URL</Label>
                        <Input
                            placeholder='https://...'
                            value={form.homepage_url}
                            onChange={(e) => update('homepage_url', e.target.value)}
                        />
                    </div>
                    <div className='space-y-1 sm:col-span-2'>
                        <Label>Docs URL</Label>
                        <Input
                            placeholder='https://..., https://...'
                            value={form.docs_url}
                            onChange={(e) => update('docs_url', e.target.value)}
                        />
                    </div>
                    <div className='space-y-1'>
                        <Label>Origin Country</Label>
                        <Input
                            placeholder='Ireland'
                            value={form.origin_country}
                            onChange={(e) => update('origin_country', e.target.value)}
                        />
                    </div>
                    <div className='space-y-1 sm:col-span-2 md:col-span-3'>
                        <Label>Architectures</Label>
                        <Input
                            placeholder='i686, x86_64'
                            value={form.architectures}
                            onChange={(e) => update('architectures', e.target.value)}
                        />
                    </div>
                    <div className='space-y-1 sm:col-span-2'>
                        <Label>Desktop Environments</Label>
                        <Input
                            placeholder='Cinnamon, MATE, Xfce'
                            value={form.desktop_environments}
                            onChange={(e) => update('desktop_environments', e.target.value)}
                        />
                    </div>
                    <div className='space-y-1 sm:col-span-2'>
                        <Label>Categories</Label>
                        <Input
                            placeholder='Beginners, Desktop, Live Medium'
                            value={form.categories}
                            onChange={(e) => update('categories', e.target.value)}
                        />
                    </div>
                    <div className='space-y-1 sm:col-span-2 md:col-span-3'>
                        <Label>Source URL</Label>
                        <Input
                            placeholder='https://..., https://...'
                            value={form.source_url}
                            onChange={(e) => update('source_url', e.target.value)}
                        />
                    </div>
                    <div className='space-y-1'>
                        <Label>Taken At</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant='outline'
                                    className={cn(
                                        'w-full justify-start text-left font-normal',
                                        !takenAtDate && 'text-muted-foreground'
                                    )}
                                >
                                    {takenAtDate ? format(takenAtDate, 'PPP') : 'Pick a date'}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className='w-auto p-0' align='start'>
                                <div className='p-3'>
                                    <Calendar
                                        mode='single'
                                        selected={takenAtDate}
                                        onSelect={(date) => {
                                            setTakenAtDate(date);
                                            updateTakenAt(date, takenAtTime);
                                        }}
                                    />
                                    <div className='mt-3'>
                                        <Label>Time</Label>
                                        <InputGroup>
                                            <InputGroupInput
                                                id='time-to'
                                                type='time'
                                                step='1'
                                                value={takenAtTime}
                                                onChange={(e) => {
                                                    setTakenAtTime(e.target.value);
                                                    updateTakenAt(takenAtDate, e.target.value);
                                                }}
                                                className='appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none'
                                            />
                                            <InputGroupAddon>
                                                <Clock2Icon className='text-muted-foreground' />
                                            </InputGroupAddon>
                                        </InputGroup>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className='space-y-1 sm:col-span-2 md:col-span-4'>
                        <Label>Description</Label>
                        <Textarea
                            placeholder='Describe the distro...'
                            value={form.description}
                            onChange={(e) => update('description', e.target.value)}
                        />
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
