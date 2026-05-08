import Fetch from '@/lib/fetch';
import { Star, UserStar } from 'lucide-react';
import Logo from '@/components/globals/logo';
import { Button } from '@/components/ui/button';
import { Link } from '@/lib/i18n/navigation';
import SearchDistro from '@/components/globals/search-distro';

type Distros = {
    distro_id: number;
    name: string;
    slug: string;
    logo: string | null;
    total_reviews: number;
    overall_rating: string;
};

type Pagination = {
    currentPage: number;
    pageSize: number;
    total: number;
    totalPages: number;
};

type Response = {
    success: boolean;
    data: Distros[];
    meta: Pagination;
};

function getPagination(current: number, total: number) {
    const delta = 2;
    const range: (number | string)[] = [];
    const left = Math.max(2, current - delta);
    const right = Math.min(total - 1, current + delta);

    range.push(1);
    if (left > 2) range.push('...');
    for (let i = left; i <= right; i++) range.push(i);
    if (right < total - 1) range.push('...');
    if (total > 1) range.push(total);

    return range;
}

const LIMIT = 12;

export default async function DistroListPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; search?: string }>;
}) {
    const { page: rawPage, search: rawSearch } = await searchParams;

    const page = Math.max(1, Number(rawPage) || 1);
    const search = rawSearch?.trim() ?? '';

    const params = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
    if (search) params.set('search', search);

    const res = await Fetch.GET<Response>(`/distros/list?${params.toString()}`);

    if (!res.success) {
        return (
            <main className='p-6'>
                <p className='text-red'>Failed to load data</p>
            </main>
        );
    }

    if (res.data.length === 0) {
        return (
            <main className='flex min-h-screen flex-col items-center justify-center gap-4 p-6'>
                <h2 className='text-foreground text-xl font-semibold'>Distro not found</h2>
                <p className='text-grey-2 text-sm'>
                    {search ? `No results found for "${search}"` : 'No distro data available'}
                </p>
                <Button asChild variant='outline'>
                    <Link href='?'>Back to list</Link>
                </Button>
            </main>
        );
    }

    const data: Distros[] = res.data;
    const meta: Pagination = res.meta;
    const pages = getPagination(meta.currentPage, meta.totalPages);

    const buildUrl = (p: number) => {
        const clamped = Math.max(1, Math.min(p, meta.totalPages));
        const q = new URLSearchParams({ page: String(clamped) });
        if (search) q.set('search', search);
        return `?${q.toString()}`;
    };

    return (
        <main className='flex min-h-screen flex-col gap-10'>
            <div className='flex flex-wrap items-start justify-between gap-3'>
                <div className='space-y-2'>
                    <h1 className='text-foreground text-3xl font-bold'>
                        Linux Distributions Explorer
                    </h1>
                    <p className='text-grey-2 text-sm'>Search and explore Linux distributions.</p>
                </div>
                <SearchDistro defaultValue={search} />
            </div>

            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {data.map((item) => {
                    const rating = Math.max(0, Math.min(5, Number(item.overall_rating) || 0));

                    return (
                        <div
                            key={`${item.distro_id}-${item.slug}`}
                            className='bg-background border-stroke rounded-2xl border p-5 shadow-sm transition hover:shadow-md'
                        >
                            <div className='flex items-center justify-between'>
                                <Logo name={item.name} image={item.logo ?? undefined} size='md' />
                                <Button variant='outline' asChild size='sm'>
                                    <Link href={`/distros/${item.slug}`}>Detail</Link>
                                </Button>
                            </div>

                            <h2 className='text-foreground mt-3 text-lg font-semibold'>
                                {item.name}
                            </h2>

                            <div className='mt-3 flex items-center justify-between'>
                                <div className='flex items-center gap-2'>
                                    <div className='flex gap-1'>
                                        {Array.from({ length: 5 }).map((_, idx) => {
                                            const fill = Math.max(0, Math.min(1, rating - idx));
                                            return (
                                                <span key={idx} className='relative size-4'>
                                                    <Star className='text-grey-1 size-4' />
                                                    <span
                                                        className='absolute inset-0 overflow-hidden'
                                                        style={{ width: `${fill * 100}%` }}
                                                    >
                                                        <Star className='fill-yellow text-yellow size-4' />
                                                    </span>
                                                </span>
                                            );
                                        })}
                                    </div>
                                    <span className='text-grey-2 text-xs'>{rating.toFixed(1)}</span>
                                </div>

                                <div className='text-grey-2 flex items-center gap-1 text-xs'>
                                    <UserStar className='size-4' />
                                    {item.total_reviews}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {meta.totalPages > 1 && (
                <div className='flex flex-wrap items-center justify-center gap-2'>
                    {meta.currentPage === 1 ? (
                        <Button variant='outline' disabled>
                            Prev
                        </Button>
                    ) : (
                        <Button variant='outline' asChild>
                            <Link href={buildUrl(meta.currentPage - 1)}>Prev</Link>
                        </Button>
                    )}

                    {pages.map((p, i) =>
                        p === '...' ? (
                            <span key={`ellipsis-${i}`} className='text-grey-2 px-2'>
                                ...
                            </span>
                        ) : p === meta.currentPage ? (
                            <Button key={`page-${p}`} variant='default' disabled>
                                {p}
                            </Button>
                        ) : (
                            <Button key={`page-${p}`} variant='outline' asChild>
                                <Link href={buildUrl(Number(p))}>{p}</Link>
                            </Button>
                        )
                    )}

                    {meta.currentPage === meta.totalPages ? (
                        <Button variant='outline' disabled>
                            Next
                        </Button>
                    ) : (
                        <Button variant='outline' asChild>
                            <Link href={buildUrl(meta.currentPage + 1)}>Next</Link>
                        </Button>
                    )}
                </div>
            )}
        </main>
    );
}
