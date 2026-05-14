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
import { Pencil } from 'lucide-react';
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
    name: string;
    lambda_param: string;
    max_distance: string;
    prior_count: string;
    scale: string;
    total_distros: string;
    top_n_recommendations: string;
    status: string;
};

type Setting = {
    name: string;
    lambda_param: string;
    max_distance: number;
    prior_count: number;
    scale: string;
    total_distros: number;
    top_n_recommendations: number;
    status: string;
};

type Response = {
    success: boolean;
    data: Setting;
    message?: string;
};

const initialState: FormState = {
    name: '',
    lambda_param: '',
    max_distance: '',
    prior_count: '',
    scale: '',
    total_distros: '',
    top_n_recommendations: '',
    status: 'INACTIVE',
};

type UpdateSettingProps = {
    id: number;
    onUpdated?: () => void;
};

export default function UpdateSetting({ id, onUpdated }: UpdateSettingProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState<FormState>(initialState);

    const update = (key: keyof FormState, value: string) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const loadSetting = useCallback(async () => {
        try {
            const res = await Fetch.GET<Response>(`/system/${id}`);
            if (res.success) {
                setForm({
                    name: res.data.name ?? '',
                    lambda_param: res.data.lambda_param ?? '',
                    max_distance: String(res.data.max_distance ?? ''),
                    prior_count: String(res.data.prior_count ?? ''),
                    scale: res.data.scale ?? String(res.data.scale ?? ''),
                    total_distros: String(res.data.total_distros ?? ''),
                    top_n_recommendations: String(res.data.top_n_recommendations ?? ''),
                    status: res.data.status ?? 'INACTIVE',
                });
            } else {
                toast.error(res.message || 'Failed to load setting data.');
            }
        } catch {
            toast.error('Failed to load setting data.');
        } finally {
            setLoading(false);
        }
    }, [id]);

    const handleOpenChange = (nextOpen: boolean) => {
        setOpen(nextOpen);
        if (nextOpen) {
            setLoading(true);
            void loadSetting();
        } else {
            setForm(initialState);
        }
    };

    const onSubmit = async () => {
        setLoading(true);
        try {
            const res = await Fetch.PATCH(`/system/${id}`, {
                name: form.name,
                lambda_param: Number(form.lambda_param),
                max_distance: Number(form.max_distance),
                prior_count: Number(form.prior_count),
                scale: Number(form.scale),
                total_distros: Number(form.total_distros),
                top_n_recommendations: Number(form.top_n_recommendations),
                status: form.status,
            });

            if (res.success === true) {
                onUpdated?.();
                setOpen(false);
                toast.success(res.message || 'Setting updated successfully!');
            } else {
                toast.error(res.message);
            }
        } catch {
            toast.error('Failed update setting!');
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
                        Update System Setting
                    </DialogTitle>
                </DialogHeader>
                <div className='grid max-h-[60vh] grid-cols-1 gap-3 overflow-y-auto p-1 md:grid-cols-2'>
                    <div className='space-y-1'>
                        <Label>Name</Label>
                        <Input
                            placeholder='Enter setting name'
                            value={form.name}
                            onChange={(e) => update('name', e.target.value)}
                        />
                    </div>
                    <div className='space-y-1'>
                        <Label>Lambda Param</Label>
                        <Input
                            type='number'
                            placeholder='Enter lambda param'
                            value={form.lambda_param}
                            onChange={(e) => update('lambda_param', e.target.value)}
                        />
                    </div>
                    <div className='space-y-1'>
                        <Label>Max Distance</Label>
                        <Input
                            type='number'
                            placeholder='Enter max distance'
                            value={form.max_distance}
                            onChange={(e) => update('max_distance', e.target.value)}
                        />
                    </div>
                    <div className='space-y-1'>
                        <Label>Prior Count</Label>
                        <Input
                            type='number'
                            placeholder='Enter prior count'
                            value={form.prior_count}
                            onChange={(e) => update('prior_count', e.target.value)}
                        />
                    </div>
                    <div className='space-y-1'>
                        <Label>Scale</Label>
                        <Input
                            type='number'
                            placeholder='Enter scale'
                            value={form.scale}
                            onChange={(e) => update('scale', e.target.value)}
                        />
                    </div>
                    <div className='space-y-1'>
                        <Label>Total Distro</Label>
                        <Input
                            type='number'
                            placeholder='Enter total distro'
                            value={form.total_distros}
                            onChange={(e) => update('total_distros', e.target.value)}
                        />
                    </div>
                    <div className='space-y-1'>
                        <Label>Top N Recommendations</Label>
                        <Input
                            type='number'
                            placeholder='Enter top N recommendations'
                            value={form.top_n_recommendations}
                            onChange={(e) => update('top_n_recommendations', e.target.value)}
                        />
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
