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
import { Link } from '@/lib/i18n/navigation';
import { useParams } from 'next/navigation';
import Unauthorized from '@/components/globals/unauthorized';

type DssRunItem = {
    id: string;
    created_at: string;
};

type DssListResponse = {
    success: boolean;
    data: DssRunItem[];
    meta: {
        currentPage: number;
        pageSize: number;
        total: number;
        totalPages: number;
    };
};

export default function ResultListPage() {
    const params = useParams();
    const username = params.username as string;

    const [runs, setRuns] = useState<DssRunItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        const loadRuns = async () => {
            try {
                const res = await Fetch.GET<DssListResponse>(`/dss/list/${username}`);
                if (!mounted) return;

                if (res.success && res.data) {
                    setRuns(res.data);
                    setError(null);
                } else {
                    setError('Failed to load data');
                }
            } catch (err) {
                console.error(err);
                if (mounted) setError('Failed to load data');
            } finally {
                if (mounted) setLoading(false);
            }
        };

        loadRuns();

        return () => {
            mounted = false;
        };
    }, [username]);

    if (loading) {
        return <main className='p-6 md:px-12 lg:px-24 lg:py-12'>Loading...</main>;
    }

    if (error) {
        return (
            <main className='p-6 md:px-12 lg:px-24 lg:py-12'>
                <Unauthorized />
            </main>
        );
    }

    return (
        <main className='space-y-6 p-6 md:px-12 lg:px-24 lg:py-12'>
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
                            <TableCell>{new Date(run.created_at).toLocaleString()}</TableCell>
                            <TableCell className='text-right'>
                                <Link
                                    href={`/${username}/results/${run.id}`}
                                    className='text-blue-600 hover:underline'
                                >
                                    View Result
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </main>
    );
}
