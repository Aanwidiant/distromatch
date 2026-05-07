import { Link } from '@/lib/i18n/navigation';
import { Button } from '../ui/button';
import Image from 'next/image';

interface EmptyStateProps {
    variant?: 'empty' | 'unauthorized';
}

export default function LocaleEmptyState({ variant = 'empty' }: EmptyStateProps) {
    const config = {
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
    }[variant];

    const finalImage = config.image;

    return (
        <main className='container mx-auto flex h-[calc(100vh-5rem)] flex-col items-center justify-center p-6'>
            <div className='relative h-96 w-full lg:w-1/2'>
                <Image
                    src={finalImage}
                    alt='not-found-img'
                    fill
                    priority
                    className='object-contain'
                />
            </div>
            <div className='flex w-full flex-col items-center gap-6 p-6 lg:w-1/2'>
                <h1 className='text-3xl font-semibold md:text-5xl'>{config.title}</h1>
                <p className='text-center text-base md:text-lg'>{config.description}</p>
                <Button size='xl' asChild>
                    <Link href='/'>Go Home</Link>
                </Button>
            </div>
        </main>
    );
}
