import Link from 'next/link';
import Image from 'next/image';

import { Button } from '../ui/button';

interface EmptyStateProps {
    variant?: 'empty' | 'unauthorized' | 'custom';

    image?: string;
    title?: string;
    description?: string;

    homeHref?: string;
    homeLabel?: string;
}

const EMPTY_STATE_CONFIG = {
    empty: {
        image: '/404.svg',
        title: 'No Data Found',
        description: 'There is nothing to show here yet.',
    },
    unauthorized: {
        image: '/403.svg',
        title: 'Access Denied',
        description: 'You do not have permission to access this page.',
    },
} as const;

export default function EmptyState({
    variant = 'empty',
    image,
    title,
    description,
    homeHref = '/',
    homeLabel = 'Go Home',
}: EmptyStateProps) {
    const fallbackConfig =
        variant === 'custom' ? EMPTY_STATE_CONFIG.empty : EMPTY_STATE_CONFIG[variant];

    const finalImage = image ?? fallbackConfig.image;
    const finalTitle = title ?? fallbackConfig.title;
    const finalDescription = description ?? fallbackConfig.description;

    return (
        <main className='container mx-auto flex h-[calc(100vh-6rem)] flex-col items-center justify-center overflow-auto p-6'>
            <div className='relative h-96 w-full lg:w-1/2'>
                <Image src={finalImage} alt={finalTitle} fill priority className='object-contain' />
            </div>
            <div className='flex w-full flex-col items-center gap-6 p-6 lg:w-1/2'>
                <h1 className='text-center text-3xl font-semibold md:text-4xl'>{finalTitle}</h1>
                <p className='text-center text-base md:text-lg'>{finalDescription}</p>
                <Button size='xl' asChild>
                    <Link href={homeHref}>{homeLabel}</Link>
                </Button>
            </div>
        </main>
    );
}
