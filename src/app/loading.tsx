import LoadingAnimation from '@/components/globals/loading-animation';

export default function Loading() {
    return (
        <main className='mx-auto flex h-[calc(100vh-6rem)] w-full max-w-330 items-center justify-center p-6'>
            <LoadingAnimation size={160} />
        </main>
    );
}
