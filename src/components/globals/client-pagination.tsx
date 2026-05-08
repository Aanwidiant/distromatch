import { Button } from '@/components/ui/button';
import { Ellipsis } from 'lucide-react';
import { useMemo } from 'react';

type Props = {
    page: number;
    totalPages: number;
    onPageChange: (p: number) => void;
};

const DELTA = 2;

export default function ClientPagination({ page, totalPages, onPageChange }: Props) {
    const pages = useMemo(() => {
        const total = totalPages || 1;
        const range: (number | string)[] = [];
        const start = Math.max(1, page - DELTA);
        const end = Math.min(total, page + DELTA);

        if (start > 1) {
            range.push(1);
            if (start > 2) range.push('...');
        }

        for (let i = start; i <= end; i++) range.push(i);

        if (end < total) {
            if (end < total - 1) range.push('...');
            range.push(total);
        }

        return range;
    }, [page, totalPages]);

    return (
        <div className='flex flex-wrap items-center justify-center gap-3'>
            <p className='text-sm'>
                Page {page} of {totalPages}
            </p>
            <div className='bg-grey-2 h-6 w-px' />

            <div className='flex items-center gap-2'>
                <Button
                    variant='outline'
                    disabled={page <= 1}
                    onClick={() => onPageChange(Math.max(1, page - 1))}
                    className='hidden md:block'
                >
                    Prev
                </Button>

                {pages.map((p, i) =>
                    p === '...' ? (
                        <span key={`ellipsis-${i}`} className='text-muted-foreground px-1'>
                            <Ellipsis className='size-4' />
                        </span>
                    ) : (
                        <Button
                            key={p}
                            variant={p === page ? 'default' : 'outline'}
                            onClick={() => onPageChange(Number(p))}
                        >
                            {p}
                        </Button>
                    )
                )}

                <Button
                    variant='outline'
                    disabled={page >= totalPages}
                    onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                    className='hidden md:block'
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
