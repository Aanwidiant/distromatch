import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
    return (
        <main className='space-y-12 p-6 md:px-12 lg:px-20 lg:py-12'>
            {/* 🔥 TOP RESULT HEADER */}
            <div className='space-y-2'>
                <Skeleton className='h-6 w-72' />
                <div className='flex items-center gap-3'>
                    <Skeleton className='h-4 w-40' />
                    <Skeleton className='h-4 w-32' />
                </div>
            </div>

            {/* 🧩 CARD GRID */}
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className='space-y-4 rounded-2xl border p-5'>
                        {/* Header */}
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-3'>
                                <Skeleton className='h-8 w-8 rounded-full' />
                                <Skeleton className='h-10 w-10' />
                            </div>
                            <Skeleton className='h-6 w-20 rounded-full' />
                        </div>

                        {/* Title */}
                        <Skeleton className='h-5 w-40' />

                        {/* Rating */}
                        <div className='flex items-center gap-3'>
                            <div className='flex gap-1'>
                                {Array.from({ length: 5 }).map((_, j) => (
                                    <Skeleton key={j} className='h-4 w-4' />
                                ))}
                            </div>
                            <Skeleton className='h-4 w-10' />
                            <Skeleton className='h-4 w-20' />
                        </div>

                        {/* Link */}
                        <Skeleton className='h-4 w-full' />

                        {/* Button */}
                        <div className='flex justify-end'>
                            <Skeleton className='h-8 w-24 rounded-md' />
                        </div>
                    </div>
                ))}
            </div>

            {/* 🔢 DETAIL TITLE */}
            <Skeleton className='h-5 w-48' />

            {/* 📑 TABS */}
            <div className='space-y-4'>
                <div className='flex gap-4 border-b pb-2'>
                    {Array.from({ length: 7 }).map((_, i) => (
                        <Skeleton key={i} className='h-4 w-24' />
                    ))}
                </div>

                {/* 📊 TABLE */}
                <div className='space-y-4 rounded-xl border p-4'>
                    {/* HEADER */}
                    <div className='grid grid-cols-4 gap-4'>
                        <Skeleton className='h-4 w-32' />
                        <Skeleton className='h-4 w-28' />
                        <Skeleton className='h-4 w-20' />
                        <Skeleton className='ml-auto h-4 w-20' />
                    </div>

                    {/* ROWS */}
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className='grid grid-cols-4 items-center gap-4'>
                            <Skeleton className='h-4 w-full' />
                            <Skeleton className='h-4 w-16' />
                            <Skeleton className='h-4 w-12' />
                            <Skeleton className='ml-auto h-4 w-16' />
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
