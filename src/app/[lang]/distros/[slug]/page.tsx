import Fetch from '@/lib/fetch';
import { notFound } from 'next/navigation';
import Logo from '@/components/globals/logo';
import { Star, UserStar, Globe } from 'lucide-react';

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

export default async function DistroDetail({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

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
        <main className='grid min-h-screen flex-col gap-10 p-6 md:px-12 lg:grid-cols-3 lg:px-20 lg:py-12'>
            <div className='space-y-10 lg:col-span-2'>
                <div className='flex items-center gap-4'>
                    <Logo name={distro.name} image={distro.logo ?? undefined} size='lg' />

                    <div>
                        <h1 className='text-3xl font-bold'>{distro.name}</h1>

                        <div className='mt-2 flex items-center gap-4'>
                            <div className='flex items-center gap-2'>
                                <Star className='size-5 fill-yellow-400 text-yellow-400' />
                                <span className='font-medium'>{rating.toFixed(1)}</span>
                            </div>

                            <div className='text-muted-foreground flex items-center gap-1 text-sm'>
                                <UserStar className='size-4' />
                                {distro.total_reviews} reviews
                            </div>
                        </div>
                    </div>
                </div>

                <div className='flex flex-wrap gap-2'>
                    {[distro.target_user_level, ...distro.categories].map((item) => (
                        <span
                            key={item}
                            className='bg-accent rounded-full border px-3 py-1 text-xs'
                        >
                            {item}
                        </span>
                    ))}
                </div>

                <div className='space-y-3'>
                    <h2 className='text-lg font-semibold'>About</h2>
                    <p className='text-muted-foreground leading-relaxed'>{distro.description}</p>
                </div>

                <div className='space-y-4'>
                    <h2 className='text-lg font-semibold'>Rating Breakdown</h2>

                    {[
                        { label: 'UX', value: distro.ux_rating },
                        { label: 'Performance', value: distro.performance_rating },
                        { label: 'Stability', value: distro.stability_rating },
                        { label: 'Features', value: distro.features_rating },
                        { label: 'Support', value: distro.support_rating },
                    ].map((item) => {
                        const val = Number(item.value) || 0;

                        return (
                            <div key={item.label} className='space-y-1'>
                                <div className='flex justify-between text-sm'>
                                    <span>{item.label}</span>
                                    <span>{val.toFixed(1)}</span>
                                </div>
                                <div className='bg-muted h-2 w-full rounded'>
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
                    <h3 className='text-sm font-semibold'>Links</h3>

                    <a
                        href={distro.homepage_url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='hover:bg-accent flex items-center gap-2 rounded-lg border px-3 py-2 text-sm'
                    >
                        <Globe className='size-4' />
                        Official Website
                    </a>
                </div>

                {distro.docs_url?.length > 0 && (
                    <div className='space-y-2'>
                        <h3 className='text-sm font-semibold'>Documentation</h3>

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
                    <Detail title='Based On' data={distro.based_on} />
                    <Detail title='Architecture' data={distro.architectures} />
                    <Detail title='Desktop' data={distro.desktop_environments} />
                    <Detail title='Origin' data={distro.origin_country} />
                </div>

                <div className='space-y-2'>
                    <h3 className='text-sm font-semibold'>Sources</h3>
                    <ul className='text-muted-foreground list-disc pl-5 text-sm'>
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
    );
}

function Detail({ title, data }: { title: string; data: string[] }) {
    return (
        <div className='space-y-2'>
            <h3 className='text-sm font-semibold'>{title}</h3>
            <div className='flex flex-wrap gap-2'>
                {data.map((item, i) => (
                    <span key={i} className='rounded-md border px-2 py-1 text-xs'>
                        {item}
                    </span>
                ))}
            </div>
        </div>
    );
}
