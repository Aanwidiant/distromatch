'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Header from '@/components/layouts/admin/header';
import { SquareChartGantt, Eye } from 'lucide-react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import ClientPagination from '@/components/globals/client-pagination';
import ProfilePicture from '@/components/globals/profile-picture';
import { formatDateTime } from '@/lib/formate-date';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';

type DssRun = {
    id: string;
    created_at: string;
    user: {
        id: string;
        name: string;
        username: string;
        photo: string;
    };
};

type UserOption = {
    id: string;
    name: string;
    username: string;
    photo: string | null;
};

type Meta = {
    currentPage: number;
    pageSize: number;
    total: number;
    totalPages: number;
};

type Response = {
    success: boolean;
    data: DssRun[];
    meta: Meta;
};

export default function DssAuditPage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<DssRun[]>([]);
    const [meta, setMeta] = useState<Meta>({
        currentPage: 1,
        pageSize: 10,
        total: 0,
        totalPages: 1,
    });

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [userId, setUserId] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('created_at');
    const [sortOrder, setSortOrder] = useState<string>('desc');

    const [users, setUsers] = useState<UserOption[]>([]);
    const [userSearch, setUserSearch] = useState('');
    const [userPage, setUserPage] = useState(1);
    const [userHasMore, setUserHasMore] = useState(true);
    const [userLoading, setUserLoading] = useState(false);

    const query = useMemo(() => {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('limit', String(limit));
        if (userId !== 'all') params.set('user_id', userId);
        if (sortBy) params.set('sort_by', sortBy);
        if (sortOrder) params.set('sort_order', sortOrder);
        return params.toString();
    }, [page, limit, userId, sortBy, sortOrder]);

    const fetchData = useCallback(async () => {
        try {
            const res = await Fetch.GET<Response>(`/dss/list?${query}`);
            if (res.success) {
                setData(res.data);
                setMeta(res.meta);
            }
        } finally {
            setLoading(false);
        }
    }, [query]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const fetchUsers = useCallback(async (pageNumber = 1, searchValue = '') => {
        try {
            setUserLoading(true);

            const params = new URLSearchParams({
                page: String(pageNumber),
                limit: '20',
            });

            if (searchValue) {
                params.set('search', searchValue);
            }

            const res = await Fetch.GET<{
                success: boolean;
                data: UserOption[];
                meta: Meta;
            }>(`/users/list?${params.toString()}`);

            if (res.success) {
                setUsers((prev) => (pageNumber === 1 ? res.data : [...prev, ...res.data]));

                setUserHasMore(pageNumber < res.meta.totalPages);
            }
        } finally {
            setUserLoading(false);
        }
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setUserPage(1);
            fetchUsers(1, userSearch);
        }, 300);

        return () => clearTimeout(timeout);
    }, [userSearch, fetchUsers]);

    useEffect(() => {
        if (userPage > 1) {
            fetchUsers(userPage, userSearch);
        }
    }, [userPage, fetchUsers, userSearch]);

    const handlePageChange = (nextPage: number) => {
        setLoading(true);
        setPage(nextPage);
    };

    return (
        <main className='bg-bg-2'>
            <Header icon={<SquareChartGantt className='size-6' />} title='DSS Audit' />
            <div className='h-[calc(100vh-4.5rem)] overflow-y-auto'>
                <div className='space-y-6 p-6'>
                    <div className='bg-background grid grid-cols-2 gap-3 rounded-lg p-6 md:grid-cols-4'>
                        <div className='space-y-1'>
                            <Label>User</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant='outline' className='w-full justify-start'>
                                        {userId === 'all'
                                            ? 'All Users'
                                            : users.find((u) => u.id === userId)?.name}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className='w-64 p-0'>
                                    <Command shouldFilter={false}>
                                        <CommandInput
                                            placeholder='Search user...'
                                            value={userSearch}
                                            onValueChange={setUserSearch}
                                        />
                                        <CommandList className='max-h-64 overflow-y-auto'>
                                            <CommandEmpty>No user found.</CommandEmpty>
                                            <CommandGroup>
                                                <CommandItem
                                                    value='all'
                                                    onSelect={() => {
                                                        setUserId('all');
                                                        setPage(1);
                                                    }}
                                                >
                                                    All Users
                                                </CommandItem>
                                                {users.map((user) => (
                                                    <CommandItem
                                                        key={user.id}
                                                        value={`${user.name} ${user.username}`}
                                                        onSelect={() => {
                                                            setUserId(user.id);
                                                            setPage(1);
                                                        }}
                                                    >
                                                        <div className='flex items-center gap-2'>
                                                            <ProfilePicture
                                                                username={user.name}
                                                                image={user.photo ?? undefined}
                                                            />
                                                            <div className='flex flex-col'>
                                                                <span>{user.name}</span>
                                                                <span className='text-muted-foreground text-xs'>
                                                                    @{user.username}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </CommandItem>
                                                ))}
                                                {userHasMore && (
                                                    <div className='p-2'>
                                                        <Button
                                                            variant='ghost'
                                                            className='w-full'
                                                            disabled={userLoading}
                                                            onClick={() =>
                                                                setUserPage((prev) => prev + 1)
                                                            }
                                                        >
                                                            {userLoading
                                                                ? 'Loading...'
                                                                : 'Load More'}
                                                        </Button>
                                                    </div>
                                                )}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className='space-y-1'>
                            <Label>Sort By</Label>
                            <Select
                                value={sortBy}
                                onValueChange={(v) => {
                                    setLoading(true);
                                    setPage(1);
                                    setSortBy(v);
                                }}
                            >
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder='Sort By' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='created_at'>Created At</SelectItem>
                                    <SelectItem value='name'>Name</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className='space-y-1'>
                            <Label>Sort Order</Label>
                            <Select
                                value={sortOrder}
                                onValueChange={(v) => {
                                    setLoading(true);
                                    setPage(1);
                                    setSortOrder(v);
                                }}
                            >
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder='Order' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='asc'>ASC</SelectItem>
                                    <SelectItem value='desc'>DESC</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className='space-y-1'>
                            <Label>Limit</Label>
                            <Select
                                value={String(limit)}
                                onValueChange={(v) => {
                                    setLoading(true);
                                    setPage(1);
                                    setLimit(Number(v));
                                }}
                            >
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder='Limit' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='10'>10</SelectItem>
                                    <SelectItem value='20'>20</SelectItem>
                                    <SelectItem value='50'>50</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className='bg-background overflow-hidden rounded-lg'>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className='text-center'>No</TableHead>
                                    <TableHead className='text-center'>User</TableHead>
                                    <TableHead className='text-center'>Create At</TableHead>
                                    <TableHead className='text-center'>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6}>Loading...</TableCell>
                                    </TableRow>
                                ) : data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6}>No data</TableCell>
                                    </TableRow>
                                ) : (
                                    data.map((item, idx) => (
                                        <TableRow key={item.id}>
                                            <TableCell className='text-center'>
                                                {(meta.currentPage - 1) * meta.pageSize + idx + 1}
                                            </TableCell>
                                            <TableCell className='flex items-center gap-3'>
                                                <ProfilePicture
                                                    username={item.user.name}
                                                    image={item.user.photo}
                                                />
                                                <span>{item.user.name}</span>
                                            </TableCell>
                                            <TableCell>{formatDateTime(item.created_at)}</TableCell>
                                            <TableCell className='space-x-1 text-center'>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button size='icon' asChild>
                                                                <Link
                                                                    href={`/admin/dss/${item.user.username}/${item.id}`}
                                                                >
                                                                    <Eye />
                                                                </Link>
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Detail</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    {meta.totalPages > 1 && (
                        <ClientPagination
                            page={page}
                            totalPages={meta.totalPages}
                            onPageChange={handlePageChange}
                        />
                    )}
                </div>
            </div>
        </main>
    );
}
