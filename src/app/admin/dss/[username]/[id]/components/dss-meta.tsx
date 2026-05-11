import Fetch from '@/lib/fetch';
import ProfilePicture from '@/components/globals/profile-picture';
import { formatDateTime } from '@/lib/formate-date';

type Props = {
    id: string;
    username: string;
};

type DssMeta = {
    id: string;
    created_at: string;
    username: string;
    name: string;
    email: string;
    photo: string | null;
};

type ApiResponse<T> = {
    success: boolean;
    data: T;
};

export default async function DssMeta({ id, username }: Props) {
    let meta: DssMeta | null = null;

    try {
        const res = await Fetch.GET<ApiResponse<DssMeta>>(`/dss/${id}/meta/${username}`);

        if (res.success === true) {
            meta = res.data;
        }
    } catch (error) {
        console.error(error);
    }

    if (!meta) {
        return <div className='p-6'>Failed to load DSS meta data</div>;
    }

    return (
        <div className='bg-background border-stroke flex flex-col gap-5 rounded-2xl border p-6 md:flex-row md:items-center md:justify-between'>
            <div className='flex items-center gap-4'>
                <ProfilePicture username={meta.name} image={meta.photo ?? undefined} size='xl' />
                <div className='space-y-1'>
                    <h2 className='text-lg font-semibold'>{meta.name}</h2>
                    <p className='ext-sm'>@{meta.username}</p>
                    <p className='ext-sm'>{meta.email}</p>
                </div>
            </div>
            <div className='space-y-1 text-sm'>
                <p>
                    <span className='font-medium'>DSS Run ID:</span> {meta.id}
                </p>
                <p>
                    <span className='font-medium'>Created At:</span>{' '}
                    {formatDateTime(meta.created_at)}
                </p>
            </div>
        </div>
    );
}
