import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
    return (
        <main className='flex min-h-screen flex-col gap-10'>
            <div className='space-y-2'>
                <Skeleton className='h-9 w-72' />
                <Skeleton className='h-4 w-96' />
            </div>
            <Skeleton className='h-10 w-full max-w-sm' />
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className='space-y-3 rounded-2xl border p-5'>
                        <div className='flex items-center justify-between'>
                            <Skeleton className='size-10 rounded-md' />
                            <Skeleton className='h-8 w-16' />
                        </div>
                        <Skeleton className='h-5 w-32' />
                        <div className='flex items-center justify-between'>
                            <Skeleton className='h-4 w-24' />
                            <Skeleton className='h-4 w-12' />
                        </div>
                    </div>
                ))}
            </div>
            <div className='flex items-center justify-center gap-2'>
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className='h-9 w-9' />
                ))}
            </div>
        </main>
    );
}
