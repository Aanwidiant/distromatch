'use client';
import LoadingAnimation from '@/components/globals/loading-animation';
import { useParams } from 'next/navigation';

export default function Loading() {
    const { lang } = useParams();

    return (
        <main className='mx-auto flex h-[calc(100vh-6rem)] w-full max-w-330 items-center justify-center p-6'>
            <LoadingAnimation lang={lang as string} size={160} />
        </main>
    );
}
