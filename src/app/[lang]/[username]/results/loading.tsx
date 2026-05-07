import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
    return (
        <main className='space-y-6 p-6 md:px-12 lg:px-20 lg:py-12'>
            {/* 🔥 TITLE */}
            <div className='space-y-2'>
                <Skeleton className='h-6 w-48' />
                <Skeleton className='h-4 w-72' />
            </div>

            {/* 📊 TABLE */}
            <div className='space-y-4 rounded-xl p-4'>
                {/* HEADER */}
                <div className='grid grid-cols-3 gap-4'>
                    <Skeleton className='h-4 w-32' />
                    <Skeleton className='h-4 w-40' />
                    <Skeleton className='ml-auto h-4 w-20' />
                </div>

                {/* ROWS */}
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className='grid grid-cols-3 items-center gap-4'>
                        <Skeleton className='h-4 w-full' />
                        <Skeleton className='h-4 w-40' />
                        <Skeleton className='ml-auto h-8 w-24' />
                    </div>
                ))}
            </div>

            {/* 🔢 PAGINATION */}
            <div className='flex justify-center gap-2'>
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className='h-9 w-9 rounded-md' />
                ))}
            </div>
        </main>
    );
}
