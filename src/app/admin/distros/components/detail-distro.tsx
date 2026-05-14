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

type Distro = {
    name: string;
    slug: string;
    logo: string | null;
    homepage_url: string;
    docs_url: string[];
    total_reviews: number;
    overall_rating: string;
    ux_rating: string;
    performance_rating: string;
    stability_rating: string;
    features_rating: string;
    support_rating: string;
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
    created_at: string;
    updated_at: string;
};

type Response = {
    success: boolean;
    data: Distro;
    message?: string;
};

type DetailDistroProps = {
    slug: string;
};

const formatList = (items?: string[] | null) => {
    if (!items || items.length === 0) return '-';
    return items.join(', ');
};

export default function DetailDistro({ slug }: DetailDistroProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<Distro | null>(null);

    const loadDistro = useCallback(async () => {
        try {
            const res = await Fetch.GET<Response>(`/distros/${slug}`);
            if (res.success) {
                setData(res.data);
            } else {
                toast.error(res.message || 'Failed to load distro detail.');
            }
        } catch {
            toast.error('Failed to load distro detail.');
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
            <DialogContent className='w-full md:max-w-4xl'>
                <DialogHeader>
                    <DialogTitle className='flex items-center gap-2'>
                        <Eye className='size-5' />
                        Detail Distro
                    </DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className='text-muted-foreground py-10 text-center text-sm'>
                        Loading...
                    </div>
                ) : !data ? (
                    <div className='text-muted-foreground py-10 text-center text-sm'>No data</div>
                ) : (
                    <div className='no-scrollbar max-h-[70vh] space-y-6 overflow-y-auto p-1'>
                        <div className='grid gap-4 sm:grid-cols-2'>
                            <div>
                                <p className='text-muted-foreground text-sm'>Name</p>
                                <p className='font-medium'>{data.name || '-'}</p>
                            </div>
                            <div>
                                <p className='text-muted-foreground text-sm'>Slug</p>
                                <p className='font-medium break-all'>{data.slug || '-'}</p>
                            </div>
                            <div>
                                <p className='text-muted-foreground text-sm'>Status</p>
                                <p className='font-medium break-all'>{data.status || '-'}</p>
                            </div>
                            <div>
                                <p className='text-muted-foreground text-sm'>Target User Level</p>
                                <p className='font-medium'>{data.target_user_level || '-'}</p>
                            </div>
                            <div>
                                <p className='text-muted-foreground text-sm'>Total Reviews</p>
                                <p className='font-medium'>{data.total_reviews ?? '-'}</p>
                            </div>
                            <div>
                                <p className='text-muted-foreground text-sm'>Overall Rating</p>
                                <p className='font-medium'>{data.overall_rating ?? '-'}</p>
                            </div>
                        </div>

                        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                            <div>
                                <p className='text-muted-foreground text-sm'>UX Rating</p>
                                <p className='font-medium'>{data.ux_rating ?? '-'}</p>
                            </div>
                            <div>
                                <p className='text-muted-foreground text-sm'>Performance Rating</p>
                                <p className='font-medium'>{data.performance_rating ?? '-'}</p>
                            </div>
                            <div>
                                <p className='text-muted-foreground text-sm'>Stability Rating</p>
                                <p className='font-medium'>{data.stability_rating ?? '-'}</p>
                            </div>
                            <div>
                                <p className='text-muted-foreground text-sm'>Features Rating</p>
                                <p className='font-medium'>{data.features_rating ?? '-'}</p>
                            </div>
                            <div>
                                <p className='text-muted-foreground text-sm'>Support Rating</p>
                                <p className='font-medium'>{data.support_rating ?? '-'}</p>
                            </div>
                        </div>

                        <div className='grid gap-4 sm:grid-cols-2'>
                            <div>
                                <p className='text-muted-foreground text-sm'>Homepage URL</p>
                                {data.homepage_url ? (
                                    <a
                                        href={data.homepage_url}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='text-primary text-sm break-all hover:underline'
                                    >
                                        {data.homepage_url}
                                    </a>
                                ) : (
                                    <p className='font-medium'>-</p>
                                )}
                            </div>
                            <div>
                                <p className='text-muted-foreground text-sm'>Docs URL</p>
                                {data.docs_url?.length ? (
                                    <ul className='space-y-1 text-sm'>
                                        {data.docs_url.map((url) => (
                                            <li key={url}>
                                                <a
                                                    href={url}
                                                    target='_blank'
                                                    rel='noopener noreferrer'
                                                    className='text-primary break-all hover:underline'
                                                >
                                                    {url}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className='font-medium'>-</p>
                                )}
                            </div>
                            <div>
                                <p className='text-muted-foreground text-sm'>Source URL</p>
                                {data.source_url?.length ? (
                                    <ul className='space-y-1 text-sm'>
                                        {data.source_url.map((url) => (
                                            <li key={url}>
                                                <a
                                                    href={url}
                                                    target='_blank'
                                                    rel='noopener noreferrer'
                                                    className='text-primary break-all hover:underline'
                                                >
                                                    {url}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className='font-medium'>-</p>
                                )}
                            </div>
                            <div>
                                <p className='text-muted-foreground text-sm'>Taken At</p>
                                <p className='font-medium'>
                                    {formatDateTime(data.taken_at ?? '')}{' '}
                                </p>
                            </div>
                            <div>
                                <p className='text-muted-foreground text-sm'>Created At</p>
                                <p className='font-medium'>
                                    {formatDateTime(data.created_at ?? '')}
                                </p>
                            </div>
                            <div>
                                <p className='text-muted-foreground text-sm'>Updated At</p>
                                <p className='font-medium'>
                                    {formatDateTime(data.updated_at ?? '')}
                                </p>
                            </div>
                        </div>

                        <div className='grid gap-4 sm:grid-cols-2'>
                            <div>
                                <p className='text-muted-foreground text-sm'>Distro Type</p>
                                <p className='font-medium'>{formatList(data.distro_type)}</p>
                            </div>
                            <div>
                                <p className='text-muted-foreground text-sm'>Based On</p>
                                <p className='font-medium'>{formatList(data.based_on)}</p>
                            </div>
                            <div>
                                <p className='text-muted-foreground text-sm'>Origin Country</p>
                                <p className='font-medium'>{formatList(data.origin_country)}</p>
                            </div>
                            <div>
                                <p className='text-muted-foreground text-sm'>Architectures</p>
                                <p className='font-medium'>{formatList(data.architectures)}</p>
                            </div>
                            <div>
                                <p className='text-muted-foreground text-sm'>
                                    Desktop Environments
                                </p>
                                <p className='font-medium'>
                                    {formatList(data.desktop_environments)}
                                </p>
                            </div>
                            <div>
                                <p className='text-muted-foreground text-sm'>Categories</p>
                                <p className='font-medium'>{formatList(data.categories)}</p>
                            </div>
                        </div>

                        <div>
                            <p className='text-muted-foreground text-sm'>Description</p>
                            <p className='text-sm leading-relaxed whitespace-pre-wrap'>
                                {data.description || '-'}
                            </p>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
