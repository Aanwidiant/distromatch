import LoadingAnimation from './loading-animation';

export default function LoadingLocale({ text = 'Loading...' }: { text?: string }) {
    return (
        <main className='mx-auto flex h-[calc(100vh-6rem)] w-full max-w-330 items-center justify-center p-6'>
            <LoadingAnimation text={text} size={160} />
        </main>
    );
}
