'use client';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function Error({
    // eslint-disable-next-line
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <main className='container mx-auto flex h-screen flex-col items-center justify-center p-6'>
            <div className='relative h-96 w-full lg:w-1/2'>
                <Image
                    src='/500.svg'
                    alt='not-found-img'
                    fill
                    priority
                    className='object-contain'
                />
            </div>
            <div className='flex w-full flex-col items-center gap-6 p-6 lg:w-1/2'>
                <h1 className='text-center text-3xl font-semibold md:text-5xl'>
                    Oops! Something went wrong.
                </h1>
                <p className='text-center text-base md:text-lg'>
                    We encountered an issue while loading this page. Please try again or contact us
                    if the problem persists.
                </p>
                <Button
                    size='xl'
                    onClick={() => {
                        window.location.reload();
                        reset();
                    }}
                >
                    Try again
                </Button>
            </div>
        </main>
    );
}
