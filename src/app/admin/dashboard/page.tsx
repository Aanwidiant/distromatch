'use client';

import { useCallback, useEffect, useState } from 'react';
import Header from '@/components/layouts/admin/header';
import { LayoutDashboard, TrendingUp, Users, Cpu, ShieldCheck } from 'lucide-react';
import Fetch from '@/lib/fetch';
import { toast } from 'sonner';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

type DashboardStats = {
    totalUsers: number;
    activeUsers: number;
    verifiedUsers: number;
    totalDistros: number;
    activeDistros: number;
    totalRuns: number;
};

type TopDistro = {
    distro_id: number;
    distro_name: string;
    total_top1: number;
};

type RecentUser = {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    created_at: string;
};

type RecentRun = {
    id: string;
    created_at: string;
    username: string;
    name: string;
};

type RunTrend = {
    date: string;
    total: number;
};

type DashboardResponse = {
    success: boolean;
    data: {
        stats: DashboardStats;
        topDistros: TopDistro[];
        recentUsers: RecentUser[];
        recentRuns: RecentRun[];
        runsTrend: RunTrend[];
    };
    message?: string;
};

const formatDateTime = (value?: string | null) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString();
};

type SimpleBadgeProps = {
    children: React.ReactNode;
    tone?: 'default' | 'outline';
};

const SimpleBadge = ({ children, tone = 'outline' }: SimpleBadgeProps) => (
    <span
        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
            tone === 'default'
                ? 'bg-primary text-primary-foreground'
                : 'border-muted text-muted-foreground border'
        }`}
    >
        {children}
    </span>
);

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<DashboardResponse['data'] | null>(null);

    const fetchDashboard = useCallback(async () => {
        try {
            const res = await Fetch.GET<DashboardResponse>('/users/dashboard');
            if (res.success) {
                setData(res.data);
            } else {
                toast.error(res.message || 'Failed to load dashboard.');
            }
        } catch {
            toast.error('Failed to load dashboard.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            void fetchDashboard();
        }, 0);

        return () => clearTimeout(timer);
    }, [fetchDashboard]);

    const maxTrend = data?.runsTrend?.length
        ? Math.max(...data.runsTrend.map((item) => item.total))
        : 0;

    return (
        <main className='bg-bg-2'>
            <Header icon={<LayoutDashboard className='size-6' />} title='Dashboard' />
            <div className='h-[calc(100vh-4.5rem)] overflow-y-auto'>
                <div className='space-y-6 p-6'>
                    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                        <div className='bg-background space-y-2 rounded-lg border p-4'>
                            <div className='flex items-center justify-between'>
                                <p className='text-muted-foreground text-sm'>Total Users</p>
                                <Users className='text-muted-foreground size-4' />
                            </div>
                            <p className='text-2xl font-semibold'>
                                {loading ? '—' : (data?.stats.totalUsers ?? 0)}
                            </p>
                            <p className='text-muted-foreground text-xs'>
                                Active: {loading ? '—' : (data?.stats.activeUsers ?? 0)} • Verified:{' '}
                                {loading ? '—' : (data?.stats.verifiedUsers ?? 0)}
                            </p>
                        </div>
                        <div className='bg-background space-y-2 rounded-lg border p-4'>
                            <div className='flex items-center justify-between'>
                                <p className='text-muted-foreground text-sm'>Total Distros</p>
                                <Cpu className='text-muted-foreground size-4' />
                            </div>
                            <p className='text-2xl font-semibold'>
                                {loading ? '—' : (data?.stats.totalDistros ?? 0)}
                            </p>
                            <p className='text-muted-foreground text-xs'>
                                Active: {loading ? '—' : (data?.stats.activeDistros ?? 0)}
                            </p>
                        </div>
                        <div className='bg-background space-y-2 rounded-lg border p-4'>
                            <div className='flex items-center justify-between'>
                                <p className='text-muted-foreground text-sm'>Total Runs</p>
                                <TrendingUp className='text-muted-foreground size-4' />
                            </div>
                            <p className='text-2xl font-semibold'>
                                {loading ? '—' : (data?.stats.totalRuns ?? 0)}
                            </p>
                            <p className='text-muted-foreground text-xs'>
                                DSS executions over time
                            </p>
                        </div>
                    </div>

                    <div className='grid gap-6 lg:grid-cols-3'>
                        <div className='bg-background space-y-4 rounded-lg border p-4 lg:col-span-1'>
                            <div className='flex items-center justify-between'>
                                <h3 className='text-sm font-semibold'>Top Distros</h3>
                                <SimpleBadge tone='outline'>Top 5</SimpleBadge>
                            </div>
                            {loading ? (
                                <p className='text-muted-foreground text-sm'>Loading...</p>
                            ) : data?.topDistros?.length ? (
                                <div className='space-y-3'>
                                    {data.topDistros.map((item, idx) => (
                                        <div
                                            key={item.distro_id}
                                            className='flex items-center justify-between'
                                        >
                                            <div className='flex items-center gap-2'>
                                                <span className='bg-muted text-muted-foreground inline-flex h-6 w-6 items-center justify-center rounded-full text-xs'>
                                                    {idx + 1}
                                                </span>
                                                <span className='text-sm font-medium'>
                                                    {item.distro_name}
                                                </span>
                                            </div>
                                            <span className='text-sm'>{item.total_top1}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className='text-muted-foreground text-sm'>No data</p>
                            )}
                        </div>

                        <div className='bg-background space-y-4 rounded-lg border p-4 lg:col-span-2'>
                            <div className='flex items-center justify-between'>
                                <h3 className='text-sm font-semibold'>Runs Trend</h3>
                                <SimpleBadge tone='outline'>Last period</SimpleBadge>
                            </div>
                            {loading ? (
                                <p className='text-muted-foreground text-sm'>Loading...</p>
                            ) : data?.runsTrend?.length ? (
                                <div className='space-y-3'>
                                    {data.runsTrend.map((item) => {
                                        const width = maxTrend
                                            ? Math.max(6, (item.total / maxTrend) * 100)
                                            : 0;
                                        return (
                                            <div key={item.date} className='space-y-1'>
                                                <div className='flex items-center justify-between text-xs'>
                                                    <span className='text-muted-foreground'>
                                                        {item.date}
                                                    </span>
                                                    <span className='font-medium'>
                                                        {item.total}
                                                    </span>
                                                </div>
                                                <div className='bg-muted h-2 w-full rounded'>
                                                    <div
                                                        className='bg-primary h-2 rounded'
                                                        style={{ width: `${width}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className='text-muted-foreground text-sm'>No data</p>
                            )}
                        </div>
                    </div>

                    <div className='grid gap-6 lg:grid-cols-2'>
                        <div className='bg-background overflow-hidden rounded-lg border'>
                            <div className='flex items-center justify-between border-b px-4 py-3'>
                                <h3 className='text-sm font-semibold'>Recent Users</h3>
                                <div className='text-muted-foreground flex items-center gap-2 text-xs'>
                                    <ShieldCheck className='size-4' /> Latest registrations
                                </div>
                            </div>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Created</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={5}>Loading...</TableCell>
                                        </TableRow>
                                    ) : data?.recentUsers?.length ? (
                                        data.recentUsers.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell className='font-medium'>
                                                    {user.name}
                                                </TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>
                                                    <SimpleBadge tone='outline'>
                                                        {user.role}
                                                    </SimpleBadge>
                                                </TableCell>
                                                <TableCell>
                                                    <SimpleBadge
                                                        tone={
                                                            user.status === 'ACTIVE'
                                                                ? 'default'
                                                                : 'outline'
                                                        }
                                                    >
                                                        {user.status}
                                                    </SimpleBadge>
                                                </TableCell>
                                                <TableCell>
                                                    {formatDateTime(user.created_at)}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5}>No data</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        <div className='bg-background overflow-hidden rounded-lg border'>
                            <div className='flex items-center justify-between border-b px-4 py-3'>
                                <h3 className='text-sm font-semibold'>Recent Runs</h3>
                                <div className='text-muted-foreground text-xs'>Latest DSS runs</div>
                            </div>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User</TableHead>
                                        <TableHead>Username</TableHead>
                                        <TableHead>Run Time</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={3}>Loading...</TableCell>
                                        </TableRow>
                                    ) : data?.recentRuns?.length ? (
                                        data.recentRuns.map((run) => (
                                            <TableRow key={run.id}>
                                                <TableCell className='font-medium'>
                                                    {run.name}
                                                </TableCell>
                                                <TableCell>{run.username}</TableCell>
                                                <TableCell>
                                                    {formatDateTime(run.created_at)}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3}>No data</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
