import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Eye } from 'lucide-react';
import Fetch from '@/lib/fetch';
import { toast } from 'sonner';
import { formatDateTime } from '@/lib/formate-date';
import ProfilePicture from '@/components/globals/profile-picture';

type Setting = {
    name: string;
    lambda_param: string;
    max_distance: number;
    prior_count: number;
    scale: string;
    total_distros: number;
    top_n_recommendations: number;
    status: string;
    updated_by_name: string;
    updated_by_photo: string;
    created_at: string;
    updated_at: string;
};

type Response = {
    success: boolean;
    data: Setting;
    message?: string;
};

type DetailSettingProps = {
    id: number;
};

export default function DetailSetting({ id }: DetailSettingProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<Setting | null>(null);

    const loadSetting = useCallback(async () => {
        try {
            const res = await Fetch.GET<Response>(`/system/${id}`);
            if (res.success) {
                setData(res.data);
            } else {
                toast.error(res.message || 'Failed to load system setting detail.');
            }
        } catch {
            toast.error('Failed to load system setting detail.');
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
            <DialogContent className='max-h-[90vh] w-full overflow-y-auto md:max-w-xl'>
                <DialogHeader>
                    <DialogTitle className='flex items-center gap-2'>
                        <Eye className='size-5' />
                        Detail System Setting
                    </DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className='text-muted-foreground py-10 text-center text-sm'>
                        Loading...
                    </div>
                ) : !data ? (
                    <div className='text-muted-foreground py-10 text-center text-sm'>No data</div>
                ) : (
                    <div className='space-y-6'>
                        <div className='grid gap-4 sm:grid-cols-2'>
                            <div>
                                <p className='text-muted-foreground text-sm'>Name</p>
                                <p className='font-medium'>{data.name || '-'}</p>
                            </div>
                            <div>
                                <p className='text-muted-foreground text-sm'>Lambda Param</p>
                                <p className='font-medium break-all'>{data.lambda_param || '-'}</p>
                            </div>
                            <div>
                                <p className='text-muted-foreground text-sm'>Max Distance</p>
                                <p className='font-medium break-all'>{data.max_distance || '-'}</p>
                            </div>
                            <div>
                                <p className='text-muted-foreground text-sm'>Scale</p>
                                <p className='font-medium'>{data.scale || '-'}</p>
                            </div>
                            <div>
                                <p className='text-muted-foreground text-sm'>Total Distro</p>
                                <p className='font-medium'>{data.total_distros ?? '-'}</p>
                            </div>
                            <div>
                                <p className='text-muted-foreground text-sm'>
                                    Top N Recommendations
                                </p>
                                <p className='font-medium'>{data.top_n_recommendations ?? '-'}</p>
                            </div>
                            <div>
                                <p className='text-muted-foreground text-sm'>Status</p>
                                <p className='font-medium'>{data.status ?? '-'}</p>
                            </div>
                            <div>
                                <p className='text-muted-foreground text-sm'>Owner</p>
                                <div className='flex items-center gap-3'>
                                    <ProfilePicture
                                        username={data.updated_by_name}
                                        image={data.updated_by_photo}
                                    />
                                    <span>{data.updated_by_name}</span>
                                </div>
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
