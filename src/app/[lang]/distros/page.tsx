import Fetch from '@/lib/fetch';
import { Star, UserStar } from 'lucide-react';
import Logo from '@/components/globals/logo';
import { Button } from '@/components/ui/button';
import { Link } from '@/lib/i18n/navigation';
import SearchDistro from '@/components/globals/search-distro';
import { getMessages, getTranslations } from 'next-intl/server';
import EmptyState from '@/components/globals/empty-state';
import { NextIntlClientProvider } from 'next-intl';

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
    params,
    searchParams,
}: {
    params: Promise<{ lang: string }>;
    searchParams: Promise<{ page?: string; search?: string }>;
}) {
    const { lang } = await params;
    const { page: rawPage, search: rawSearch } = await searchParams;
    const t = await getTranslations({ locale: lang, namespace: 'distro' });

    const messages = await getMessages();

    const page = Math.max(1, Number(rawPage) || 1);
    const search = rawSearch?.trim() ?? '';

    const apiParams = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
    if (search) apiParams.set('search', search);

    const res = await Fetch.GET<Response>(`/distros/list?${apiParams.toString()}`);

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
        <NextIntlClientProvider messages={messages}>
            <main className='p-6 md:px-12 lg:px-20'>
                {!res.success ? (
                    <EmptyState
                        variant='custom'
                        image='/500.svg'
                        title={t('failedToLoadData')}
                        description={t('anErrorOccurredWhileLoadingDataPleaseTryAgainLater')}
                        homeHref='?'
                        homeLabel={t('reload')}
                    />
                ) : res.data.length === 0 ? (
                    <EmptyState
                        variant='custom'
                        image='/404.svg'
                        title={t('distroNotFound')}
                        description={
                            search
                                ? `${t('noResultsFoundFor')} "${search}"`
                                : t('noDistroDataAvailable')
                        }
                        homeHref='?'
                        homeLabel={t('backToList')}
                    />
                ) : (
                    <div className='mx-auto max-w-330 space-y-16 overflow-hidden py-6'>
                        <div className='flex flex-wrap items-start justify-between gap-3'>
                            <div className='space-y-2'>
                                <h1 className='text-foreground text-3xl font-bold'>
                                    {t('linuxDistributionsExplorer')}
                                </h1>
                                <p className='text-grey-2 text-sm'>
                                    {t('searchAndExploreLinuxDistributions')}
                                </p>
                            </div>
                            <SearchDistro defaultValue={search} />
                        </div>
                        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                            {data.map((item) => {
                                const rating = Math.max(
                                    0,
                                    Math.min(5, Number(item.overall_rating) || 0)
                                );

                                return (
                                    <div
                                        key={`${item.distro_id}-${item.slug}`}
                                        className='bg-background border-stroke rounded-2xl border p-5 shadow-sm transition hover:shadow-md'
                                    >
                                        <div className='flex items-center justify-between'>
                                            <Logo
                                                name={item.name}
                                                image={item.logo ?? undefined}
                                                size='md'
                                            />
                                            <Button variant='outline' asChild size='sm'>
                                                <Link href={`/distros/${item.slug}`}>
                                                    {t('detail')}
                                                </Link>
                                            </Button>
                                        </div>

                                        <h2 className='text-foreground mt-3 text-lg font-semibold'>
                                            {item.name}
                                        </h2>
                                        <div className='mt-3 flex items-center justify-between'>
                                            <div className='flex items-center gap-2'>
                                                <div className='flex gap-1'>
                                                    {Array.from({ length: 5 }).map((_, idx) => {
                                                        const fill = Math.max(
                                                            0,
                                                            Math.min(1, rating - idx)
                                                        );
                                                        return (
                                                            <span
                                                                key={idx}
                                                                className='relative size-4'
                                                            >
                                                                <Star className='text-grey-1 size-4' />
                                                                <span
                                                                    className='absolute inset-0 overflow-hidden'
                                                                    style={{
                                                                        width: `${fill * 100}%`,
                                                                    }}
                                                                >
                                                                    <Star className='fill-yellow text-yellow size-4' />
                                                                </span>
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                                <span className='text-grey-2 text-xs'>
                                                    {rating.toFixed(1)}
                                                </span>
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
                                        {t('prev')}
                                    </Button>
                                ) : (
                                    <Button variant='outline' asChild>
                                        <Link href={buildUrl(meta.currentPage - 1)}>
                                            {t('prev')}
                                        </Link>
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
                                        {t('next')}
                                    </Button>
                                ) : (
                                    <Button variant='outline' asChild>
                                        <Link href={buildUrl(meta.currentPage + 1)}>
                                            {t('next')}
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </main>
        </NextIntlClientProvider>
    );
}
