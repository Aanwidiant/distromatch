'use client';

import { useEffect, useState } from 'react';
import Fetch from '@/lib/fetch';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Link } from '@/lib/i18n/navigation';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Loading from './loading';
import { Eye } from 'lucide-react';
import ConfirmDeleteResult from '@/components/result/delete-result';
import { formatDateTime } from '@/lib/formate-date';
import { useLocale } from 'next-intl';
import LocaleEmptyState from '@/components/globals/locale-empty-state';

type DssRunItem = {
    id: string;
    created_at: string;
};

type PaginationMeta = {
    currentPage: number;
    pageSize: number;
    total: number;
    totalPages: number;
};

type DssListResponse = {
    success: boolean;
    data: DssRunItem[];
    meta: PaginationMeta;
};

export default function ResultListPage() {
    const params = useParams();
    const username = params.username as string;
    const locale = useLocale();

    const [runs, setRuns] = useState<DssRunItem[]>([]);
    const [meta, setMeta] = useState<PaginationMeta | null>(null);

    const [page, setPage] = useState(1);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            const res = await Fetch.GET<DssListResponse>(`/dss/list/${username}?page=${page}`);

            if (res.success) {
                setRuns(res.data);
                setMeta(res.meta);
                setError(null);
            } else {
                setError('Failed to load data');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let ignore = false;

        const load = async () => {
            setLoading(true);

            try {
                const res = await Fetch.GET<DssListResponse>(`/dss/list/${username}?page=${page}`);

                if (ignore) return;

                if (res.success) {
                    setRuns(res.data);
                    setMeta(res.meta);
                    setError(null);
                } else {
                    setError('Failed to load data');
                }
            } catch (err) {
                if (!ignore) {
                    console.error(err);
                    setError('Failed to load data');
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        };

        load();

        return () => {
            ignore = true;
        };
    }, [page, username]);

    const getPages = () => {
        if (!meta) return [];

        const total = meta.totalPages;
        const current = meta.currentPage;

        const delta = 2;
        const range: number[] = [];

        for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
            range.push(i);
        }

        return range;
    };

    if (loading) {
        return <Loading />;
    }

    if (runs.length === 0 && meta) {
        return <LocaleEmptyState variant='empty' />;
    }

    if (error || !meta) {
        return <LocaleEmptyState variant='unauthorized' />;
    }

    return (
        <main className='space-y-6 p-6 md:px-12 lg:px-20 lg:py-12'>
            <h1 className='text-2xl font-bold'>Your DSS Results</h1>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead className='text-right'>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {runs.map((run) => (
                        <TableRow key={run.id}>
                            <TableCell className='font-medium'>{run.id}</TableCell>
                            <TableCell>{formatDateTime(run.created_at, locale)}</TableCell>
                            <TableCell className='space-x-2 text-right'>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button size='icon' asChild>
                                                <Link href={`/${username}/results/${run.id}`}>
                                                    <Eye />
                                                </Link>
                                            </Button>
                                        </TooltipTrigger>

                                        <TooltipContent>
                                            <p>View Result</p>
                                        </TooltipContent>
                                    </Tooltip>

                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className='inline-block'>
                                                <ConfirmDeleteResult
                                                    id={run.id}
                                                    createdAt={run.created_at}
                                                    onDeleted={() => fetchData()}
                                                />
                                            </div>
                                        </TooltipTrigger>

                                        <TooltipContent>
                                            <p>Delete Result</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className='flex flex-wrap items-center justify-center gap-2'>
                <Button
                    variant='outline'
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                >
                    Prev
                </Button>

                {page > 3 && (
                    <>
                        <Button variant='outline' onClick={() => setPage(1)}>
                            1
                        </Button>
                        <span>...</span>
                    </>
                )}

                {getPages().map((p) => (
                    <Button
                        key={p}
                        variant={p === page ? 'default' : 'outline'}
                        onClick={() => setPage(p)}
                    >
                        {p}
                    </Button>
                ))}

                {meta.totalPages - page > 2 && (
                    <>
                        <span>...</span>
                        <Button variant='outline' onClick={() => setPage(meta.totalPages)}>
                            {meta.totalPages}
                        </Button>
                    </>
                )}

                <Button
                    variant='outline'
                    disabled={page === meta.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                >
                    Next
                </Button>
            </div>
        </main>
    );
}
