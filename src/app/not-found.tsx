'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
    return (
        <main className='container mx-auto flex h-screen flex-col items-center justify-center p-6'>
            <div className='relative h-96 w-full lg:w-1/2'>
                <Image
                    src='/404.svg'
                    alt='not-found-img'
                    fill
                    priority
                    className='object-contain'
                />
            </div>
            <div className='flex w-full flex-col items-center gap-6 p-6 lg:w-1/2'>
                <h1 className='text-center text-3xl font-semibold md:text-5xl'>
                    Opps! Page not found
                </h1>
                <p className='text-center text-base md:text-lg'>
                    Something went wrong! It looks like the link is broken or the page has been
                    removed.
                </p>
                <Button size='xl' className='w-fit' asChild>
                    <Link href='/'>Back to Home</Link>
                </Button>
            </div>
        </main>
    );
}
