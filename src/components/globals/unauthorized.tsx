import { Link } from '@/lib/i18n/navigation';

export default function Unauthorized() {
    return (
        <div className='flex h-[60vh] items-center justify-center'>
            <div className='space-y-4 text-center'>
                <h1 className='text-2xl font-semibold'>Session Expired</h1>
                <p className='text-muted-foreground'>
                    Your session has expired or you are not authorized.
                </p>
                <Link href='/' className='bg-primary inline-block rounded-md px-4 py-2 text-white'>
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
