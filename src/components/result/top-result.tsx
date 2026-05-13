import Fetch from '@/lib/fetch';
import { notFound } from 'next/navigation';
import { Star, UserStar, CalendarClock } from 'lucide-react';
import Logo from '../globals/logo';
import { Button } from '../ui/button';
import { Link } from '@/lib/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { formatDateTime } from '@/lib/formate-date';

type Recommendation = {
    rank_position: number;
    distro_id: number;
    name: string;
    slug: string;
    logo: string | null;
    homepage_url: string | null;
    total_reviews: number;
    overall_rating: string;
    final_score: string;
};

type Response = {
    success: boolean;
    data: {
        run_id: string;
        run_created_at: string;
        user_name: string;
        top_n: number;
        recommendations: Recommendation[];
    };
};

type Props = {
    runId: string;
    lang: string;
};

export default async function TopResult({ runId, lang }: Props) {
    let data: Response['data'] | null = null;
    const t = await getTranslations('result.topResult');

    try {
        const res = await Fetch.GET<Response>(`/dss/${runId}/recommendations`);

        if (res.success) {
            data = res.data;
        }
    } catch (err) {
        console.error(err);
    }

    if (!data) return notFound();

    return (
        <>
            <div className='space-y-2'>
                <h1 className='text-2xl font-bold'>{t('title', { n: data.top_n })}</h1>
                <p className='text-grey-2 flex gap-2 text-sm'>
                    {t('generatedFor')} <span className='font-medium'>{data.user_name}</span>
                    <CalendarClock className='stroke-grey-2 size-5' />
                    {formatDateTime(data.run_created_at, lang)}
                </p>
            </div>
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {data.recommendations.map((item) => {
                    const ratingValue = Math.max(0, Math.min(5, Number(item.overall_rating) || 0));
                    return (
                        <div
                            key={item.distro_id}
                            className='border-stroke bg-bg-2 space-y-4 rounded-2xl border p-5 shadow transition hover:-translate-y-0.5 hover:shadow'
                        >
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-3'>
                                    <span className='bg-accent-1 text-primary border-primary/30 rounded-full border p-2 text-sm font-semibold'>
                                        #{item.rank_position}
                                    </span>
                                    <Logo
                                        name={item.name}
                                        image={item?.logo ?? undefined}
                                        size='md'
                                    />
                                </div>
                                <span className='bg-accent-1 text-primary border-primary/30 rounded-full border px-3 py-1 text-xs font-semibold'>
                                    {t('labels.score')}: {item.final_score}
                                </span>
                            </div>
                            <h2 className='text-lg font-semibold'>{item.name}</h2>
                            <div className='flex items-center gap-3'>
                                <div className='flex items-center gap-1'>
                                    {Array.from({ length: 5 }).map((_, idx) => {
                                        const fill = Math.max(0, Math.min(1, ratingValue - idx));
                                        return (
                                            <span key={idx} className='relative size-4'>
                                                <Star className='text-grey-1 size-4' />
                                                <span
                                                    className='absolute inset-0 overflow-hidden'
                                                    style={{ width: `${fill * 100}%` }}
                                                >
                                                    <Star className='text-yellow fill-yellow size-4' />
                                                </span>
                                            </span>
                                        );
                                    })}
                                </div>
                                <span className='text-grey-2 text-xs'>
                                    {ratingValue.toFixed(1)} / 5
                                </span>
                                <div className='flex items-center gap-2'>
                                    <UserStar className='stroke-grey-2 size-5' />
                                    <span className='text-grey-2 text-xs'>
                                        {item.total_reviews} {t('labels.reviews')}
                                    </span>
                                </div>
                            </div>
                            <div className='space-y-2 text-xs'>
                                {item.homepage_url && (
                                    <div className='flex flex-wrap items-center gap-2'>
                                        <span className='text-grey-3 font-semibold'>
                                            {t('labels.website')}
                                        </span>
                                        <a
                                            href={item.homepage_url}
                                            target='_blank'
                                            rel='noreferrer'
                                            className='text-primary break-all hover:underline'
                                        >
                                            {item.homepage_url}
                                        </a>
                                    </div>
                                )}
                            </div>
                            <div className='flex justify-end'>
                                <Button variant='outline' asChild size='sm'>
                                    <Link href={`/distros/${item.slug}`}>
                                        {t('labels.viewDetail')}
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
