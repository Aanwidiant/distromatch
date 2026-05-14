import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Clock2Icon, Pencil } from 'lucide-react';
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

type Distro = {
    name: string;
    homepage_url: string;
    docs_url: string[];
    ux_rating: string;
    performance_rating: string;
    stability_rating: string;
    features_rating: string;
    support_rating: string;
    total_reviews: number;
    target_user_level: string;
    distro_type: string[];
    based_on: string[];
    origin_country: string[];
    architectures: string[];
    desktop_environments: string[];
    categories: string[];
    status: string;
    description: string;
    source_url: string[];
    taken_at?: string | null;
};

type Response = {
    success: boolean;
    data: Distro;
    message?: string;
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

type UpdateDistroProps = {
    slug: string;
    onUpdated?: () => void;
};

const toArray = (value: string) =>
    value
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean);

const toStringList = (value?: string[] | null) => (value ?? []).join(', ');

const toTimeString = (date: Date) => {
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
};

export default function UpdateDistro({ slug, onUpdated }: UpdateDistroProps) {
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

    const applyTakenAt = (value?: string | null) => {
        if (!value) {
            setTakenAtDate(undefined);
            setTakenAtTime('10:00:00');
            return;
        }
        const parsed = new Date(value);
        if (Number.isNaN(parsed.getTime())) {
            setTakenAtDate(undefined);
            setTakenAtTime('10:00:00');
            return;
        }
        setTakenAtDate(parsed);
        setTakenAtTime(toTimeString(parsed));
    };

    const loadDistro = useCallback(async () => {
        try {
            const res = await Fetch.GET<Response>(`/distros/${slug}`);
            if (res.success) {
                setForm({
                    name: res.data.name ?? '',
                    homepage_url: res.data.homepage_url ?? '',
                    docs_url: toStringList(res.data.docs_url),
                    ux_rating: String(res.data.ux_rating ?? ''),
                    performance_rating: String(res.data.performance_rating ?? ''),
                    stability_rating: String(res.data.stability_rating ?? ''),
                    features_rating: String(res.data.features_rating ?? ''),
                    support_rating: String(res.data.support_rating ?? ''),
                    total_reviews: String(res.data.total_reviews ?? ''),
                    target_user_level: res.data.target_user_level ?? '',
                    distro_type: toStringList(res.data.distro_type),
                    based_on: toStringList(res.data.based_on),
                    origin_country: toStringList(res.data.origin_country),
                    architectures: toStringList(res.data.architectures),
                    desktop_environments: toStringList(res.data.desktop_environments),
                    categories: toStringList(res.data.categories),
                    status: res.data.status ?? 'INACTIVE',
                    description: res.data.description ?? '',
                    source_url: toStringList(res.data.source_url),
                    taken_at: res.data.taken_at ?? '',
                });
                applyTakenAt(res.data.taken_at ?? undefined);
            } else {
                toast.error(res.message || 'Failed to load distro data.');
            }
        } catch {
            toast.error('Failed to load distro data.');
        } finally {
            setLoading(false);
        }
    }, [slug]);

    const handleOpenChange = (nextOpen: boolean) => {
        setOpen(nextOpen);
        if (nextOpen) {
            setLoading(true);
            void loadDistro();
        } else {
            setForm(initialState);
            setTakenAtDate(undefined);
            setTakenAtTime('10:00:00');
        }
    };

    const onSubmit = async () => {
        setLoading(true);
        try {
            const res = await Fetch.PATCH(`/distros/${slug}`, {
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
                onUpdated?.();
                setOpen(false);
                toast.success(res.message || 'Distro updated successfully!');
            } else {
                toast.error(res.message || 'Failed update distro!');
            }
        } catch {
            toast.error('Failed update distro!');
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
                className='w-full md:max-w-4xl'
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle className='flex items-center gap-2'>
                        <Pencil className='size-5' />
                        Update Distro
                    </DialogTitle>
                </DialogHeader>
                <div className='no-scrollbar grid max-h-[60vh] grid-cols-1 gap-3 overflow-y-auto p-1 sm:grid-cols-2 md:grid-cols-4'>
                    <div className='space-y-1'>
                        <Label>Name</Label>
                        <Input
                            placeholder='Enter distro name'
                            value={form.name}
                            onChange={(e) => update('name', e.target.value)}
                        />
                    </div>

                    <div className='space-y-1'>
                        <Label>Total Reviews</Label>
                        <Input
                            type='number'
                            placeholder='Enter total reviews'
                            value={form.total_reviews}
                            onChange={(e) => update('total_reviews', e.target.value)}
                        />
                    </div>

                    <div className='space-y-1'>
                        <Label>UX Rating</Label>
                        <Input
                            type='number'
                            step='0.1'
                            placeholder='Enter rating'
                            value={form.ux_rating}
                            onChange={(e) => update('ux_rating', e.target.value)}
                        />
                    </div>

                    <div className='space-y-1'>
                        <Label>Performance Rating</Label>
                        <Input
                            type='number'
                            step='0.1'
                            placeholder='Enter rating'
                            value={form.performance_rating}
                            onChange={(e) => update('performance_rating', e.target.value)}
                        />
                    </div>

                    <div className='space-y-1'>
                        <Label>Stability Rating</Label>
                        <Input
                            type='number'
                            step='0.1'
                            placeholder='Enter rating'
                            value={form.stability_rating}
                            onChange={(e) => update('stability_rating', e.target.value)}
                        />
                    </div>

                    <div className='space-y-1'>
                        <Label>Features Rating</Label>
                        <Input
                            type='number'
                            step='0.1'
                            placeholder='Enter rating'
                            value={form.features_rating}
                            onChange={(e) => update('features_rating', e.target.value)}
                        />
                    </div>

                    <div className='space-y-1'>
                        <Label>Support Rating</Label>
                        <Input
                            type='number'
                            step='0.1'
                            placeholder='Enter rating'
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
                            placeholder='Enter distro type'
                            value={form.distro_type}
                            onChange={(e) => update('distro_type', e.target.value)}
                        />
                    </div>
                    <div className='space-y-1 sm:col-span-2'>
                        <Label>Based On</Label>
                        <Input
                            placeholder='Enter base distros (comma-separated)'
                            value={form.based_on}
                            onChange={(e) => update('based_on', e.target.value)}
                        />
                    </div>
                    <div className='space-y-1 sm:col-span-2'>
                        <Label>Homepage URL</Label>
                        <Input
                            placeholder='Enter homepage URL'
                            value={form.homepage_url}
                            onChange={(e) => update('homepage_url', e.target.value)}
                        />
                    </div>
                    <div className='space-y-1 sm:col-span-2'>
                        <Label>Docs URL</Label>
                        <Input
                            placeholder='Enter docs URLs (comma-separated)'
                            value={form.docs_url}
                            onChange={(e) => update('docs_url', e.target.value)}
                        />
                    </div>
                    <div className='space-y-1'>
                        <Label>Origin Country</Label>
                        <Input
                            placeholder='Enter origin country'
                            value={form.origin_country}
                            onChange={(e) => update('origin_country', e.target.value)}
                        />
                    </div>
                    <div className='space-y-1 sm:col-span-2 md:col-span-3'>
                        <Label>Architectures</Label>
                        <Input
                            placeholder='Enter architectures (comma-separated)'
                            value={form.architectures}
                            onChange={(e) => update('architectures', e.target.value)}
                        />
                    </div>
                    <div className='space-y-1 sm:col-span-2'>
                        <Label>Desktop Environments</Label>
                        <Input
                            placeholder='Enter desktop environments (comma-separated)'
                            value={form.desktop_environments}
                            onChange={(e) => update('desktop_environments', e.target.value)}
                        />
                    </div>
                    <div className='space-y-1 sm:col-span-2'>
                        <Label>Categories</Label>
                        <Input
                            placeholder='Enter categories (comma-separated)'
                            value={form.categories}
                            onChange={(e) => update('categories', e.target.value)}
                        />
                    </div>
                    <div className='space-y-1 sm:col-span-2 md:col-span-3'>
                        <Label>Source URL</Label>
                        <Input
                            placeholder='Enter source URLs (comma-separated)'
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
                        {loading ? 'Updating...' : 'Update'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
