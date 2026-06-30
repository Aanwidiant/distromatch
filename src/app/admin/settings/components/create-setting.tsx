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
    name: string;
    lambda_param: string;
    max_distance: string;
    prior_count: string;
    scale: string;
    exponent: string;
    total_distros: string;
    top_n_recommendations: string;
    status: string;
};

const initialState: FormState = {
    name: '',
    lambda_param: '',
    max_distance: '',
    prior_count: '',
    scale: '',
    exponent: '',
    total_distros: '',
    top_n_recommendations: '',
    status: 'ACTIVE',
};

type CreateSettingProps = {
    onCreated?: () => void;
};

export default function CreateSetting({ onCreated }: CreateSettingProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState<FormState>(initialState);

    const update = (key: keyof FormState, value: string) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const onSubmit = async () => {
        setLoading(true);
        try {
            const res = await Fetch.POST('/system', {
                name: form.name,
                lambda_param: Number(form.lambda_param),
                max_distance: Number(form.max_distance),
                prior_count: Number(form.prior_count),
                scale: Number(form.scale),
                exponent: Number(form.exponent),
                total_distros: Number(form.total_distros),
                top_n_recommendations: Number(form.top_n_recommendations),
                status: form.status,
            });

            if (res.success === true) {
                onCreated?.();
                setOpen(false);
                setForm(initialState);
                toast.success(res.message || 'Setting created successfully!');
            } else {
                toast.error(res.message);
            }
        } catch {
            toast.error('Failed create setting!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className='flex w-fit gap-1'>
                    <BadgePlus className='size-4' />
                    <p>Create System Setting</p>
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
                        Create System Setting
                    </DialogTitle>
                </DialogHeader>
                <div className='grid max-h-[60vh] grid-cols-1 gap-3 overflow-y-auto p-1 md:grid-cols-2'>
                    <div className='space-y-1 md:col-span-2'>
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
                        <Label>Exponent</Label>
                        <Input
                            type='number'
                            placeholder='Enter exponent'
                            value={form.exponent}
                            onChange={(e) => update('exponent', e.target.value)}
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
                        {loading ? 'Creating...' : 'Create'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
