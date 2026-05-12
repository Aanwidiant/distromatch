import Fetch from '@/lib/fetch';
import { notFound } from 'next/navigation';
import Logo from '@/components/globals/logo';
import { Star, UserStar, Globe } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { loadMessages } from '@/lib/i18n/get-messages';
import { NextIntlClientProvider } from 'next-intl';

type Distro = {
    id: number;
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
    description: string;
    source_url: string[];
    created_at: string;
};

type Response = {
    success: boolean;
    data: Distro;
};

export default async function DistroDetail({
    params,
}: {
    params: Promise<{ slug: string; lang: string }>;
}) {
    const { slug, lang } = await params;

    const t = await getTranslations({ locale: lang, namespace: 'distro.detailPage' });

    const messages = await loadMessages(lang, ['distro']);

    let distro: Distro | null = null;

    try {
        const res = await Fetch.GET<Response>(`/distros/${slug}`);
        if (res.success) distro = res.data;
    } catch {
        //
    }

    if (!distro) return notFound();

    const rating = Math.max(0, Math.min(5, Number(distro.overall_rating) || 0));

    return (
        <NextIntlClientProvider locale={lang} messages={messages}>
            <main className='grid flex-col gap-10 p-6 md:px-12 lg:grid-cols-3 lg:px-20'>
                <div className='mx-auto max-w-330 space-y-12 overflow-hidden py-6 lg:col-span-2'>
                    <div className='flex items-center gap-4'>
                        <Logo name={distro.name} image={distro.logo ?? undefined} size='lg' />
                        <div>
                            <h1 className='text-foreground text-3xl font-bold'>{distro.name}</h1>
                            <div className='mt-2 flex items-center gap-4'>
                                <div className='flex items-center gap-2'>
                                    <Star className='fill-yellow text-yellow size-5' />
                                    <span className='text-foreground font-medium'>
                                        {rating.toFixed(1)}
                                    </span>
                                </div>
                                <div className='text-grey-2 flex items-center gap-1 text-sm'>
                                    <UserStar className='size-4' />
                                    {distro.total_reviews}{' '}
                                    {t('reviews', { count: distro.total_reviews })}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-wrap gap-2'>
                        {[distro.target_user_level, ...distro.categories].map((item) => (
                            <span
                                key={item}
                                className='border-stroke bg-accent-1 text-grey-3 rounded-full border px-3 py-1 text-xs'
                            >
                                {item}
                            </span>
                        ))}
                    </div>
                    <div className='space-y-3'>
                        <h2 className='text-foreground text-lg font-semibold'>{t('about')}</h2>
                        <p className='text-grey-3 leading-relaxed'>{distro.description}</p>
                    </div>
                    <div className='space-y-4'>
                        <h2 className='text-foreground text-lg font-semibold'>
                            {t('ratingBreakdown')}
                        </h2>
                        {[
                            { label: t('ratings.ux'), value: distro.ux_rating },
                            { label: t('ratings.performance'), value: distro.performance_rating },
                            { label: t('ratings.stability'), value: distro.stability_rating },
                            { label: t('ratings.features'), value: distro.features_rating },
                            { label: t('ratings.support'), value: distro.support_rating },
                        ].map((item) => {
                            const val = Number(item.value) || 0;
                            return (
                                <div key={item.label} className='space-y-1'>
                                    <div className='text-grey-2 flex justify-between text-sm'>
                                        <span>{item.label}</span>
                                        <span>{val.toFixed(1)}</span>
                                    </div>
                                    <div className='bg-bg-2 h-2 w-full rounded'>
                                        <div
                                            className='bg-primary h-2 rounded'
                                            style={{ width: `${(val / 5) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className='space-y-6'>
                    <div className='space-y-2'>
                        <h3 className='text-foreground text-sm font-semibold'>{t('links')}</h3>
                        <a
                            href={distro.homepage_url}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='border-stroke hover:bg-accent-1 text-foreground flex items-center gap-2 rounded-lg border px-3 py-2 text-sm'
                        >
                            <Globe className='size-4' />
                            {t('officialWebsite')}
                        </a>
                    </div>
                    {distro.docs_url?.length > 0 && (
                        <div className='space-y-2'>
                            <h3 className='text-foreground text-sm font-semibold'>
                                {t('documentation')}
                            </h3>
                            <div className='flex flex-col gap-2'>
                                {distro.docs_url.map((url) => (
                                    <a
                                        key={url}
                                        href={url}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='text-primary truncate text-sm hover:underline'
                                    >
                                        {new URL(url).hostname}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className='space-y-4'>
                        <Detail title={t('details.basedOn')} data={distro.based_on} />
                        <Detail title={t('details.architecture')} data={distro.architectures} />
                        <Detail title={t('details.desktop')} data={distro.desktop_environments} />
                        <Detail title={t('details.origin')} data={distro.origin_country} />
                    </div>
                    <div className='space-y-2'>
                        <h3 className='text-foreground text-sm font-semibold'>{t('sources')}</h3>
                        <ul className='text-grey-2 list-disc pl-5 text-sm'>
                            {distro.source_url.map((url) => (
                                <li key={url}>
                                    <a
                                        href={url}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='break-all hover:underline'
                                    >
                                        {url}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </main>
        </NextIntlClientProvider>
    );
}

function Detail({ title, data }: { title: string; data: string[] }) {
    return (
        <div className='space-y-2'>
            <h3 className='text-foreground text-sm font-semibold'>{title}</h3>
            <div className='flex flex-wrap gap-2'>
                {data.map((item, i) => (
                    <span
                        key={i}
                        className='border-stroke bg-bg-2 text-grey-2 rounded-md border px-2 py-1 text-xs'
                    >
                        {item}
                    </span>
                ))}
            </div>
        </div>
    );
}
