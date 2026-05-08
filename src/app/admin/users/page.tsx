'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Header from '@/components/layouts/admin/header';
import { Users, Search } from 'lucide-react';
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
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
import ClientPagination from '@/components/globals/client-pagination';
import ProfilePicture from '@/components/globals/profile-picture';
import CreateUser from './components/create-user';
import UpdateUser from './components/update-user';
import DetailUser from './components/detail-user';

export type User = {
    id: number;
    email: string;
    name: string;
    username: string;
    photo: string;
    role: string;
    status: string;
    email_verified: boolean;
    session_expired_at: string;
    provider: string;
    created_at: string;
    updated_at: string;
};

type Meta = {
    currentPage: number;
    pageSize: number;
    total: number;
    totalPages: number;
};

type Response = {
    success: boolean;
    data: User[];
    meta: Meta;
};

export default function AdminUsersPage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<User[]>([]);
    const [meta, setMeta] = useState<Meta>({
        currentPage: 1,
        pageSize: 10,
        total: 0,
        totalPages: 1,
    });

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState<string>('all');
    const [role, setRole] = useState<string>('all');

    const query = useMemo(() => {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('limit', String(limit));
        if (search) params.set('search', search);
        if (status !== 'all') params.set('status', status);
        if (role !== 'all') params.set('role', role);
        return params.toString();
    }, [page, limit, search, status, role]);

    const fetchData = useCallback(async () => {
        try {
            const res = await Fetch.GET<Response>(`/users/list?${query}`);
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

    const handlePageChange = (nextPage: number) => {
        setLoading(true);
        setPage(nextPage);
    };

    const handleReload = () => {
        setLoading(true);
        void fetchData();
    };

    return (
        <main>
            <Header icon={<Users className='size-6' />} title='User' />
            <div className='h-[calc(100vh-4.5rem)] overflow-y-auto'>
                <div className='space-y-6 p-6'>
                    <div className='bg-background grid grid-cols-2 gap-3 rounded-lg p-6 md:grid-cols-4'>
                        <div className='space-y-1'>
                            <Label>Search</Label>
                            <InputGroup>
                                <InputGroupAddon>
                                    <Search />
                                </InputGroupAddon>
                                <InputGroupInput
                                    placeholder='Search distro...'
                                    type='text'
                                    onChange={(e) => {
                                        setLoading(true);
                                        setPage(1);
                                        setSearch(e.target.value);
                                    }}
                                />
                            </InputGroup>
                        </div>
                        <div className='space-y-1'>
                            <Label>Status</Label>
                            <Select
                                value={status}
                                onValueChange={(v) => {
                                    setLoading(true);
                                    setPage(1);
                                    setStatus(v);
                                }}
                            >
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder='Status' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='all'>All</SelectItem>
                                    <SelectItem value='ACTIVE'>ACTIVE</SelectItem>
                                    <SelectItem value='INACTIVE'>INACTIVE</SelectItem>
                                    <SelectItem value='SUSPENDED'>SUSPENDED</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className='space-y-1'>
                            <Label>Role</Label>
                            <Select
                                value={role}
                                onValueChange={(v) => {
                                    setLoading(true);
                                    setPage(1);
                                    setRole(v);
                                }}
                            >
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder='Role' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='all'>All</SelectItem>
                                    <SelectItem value='USER'>USER</SelectItem>
                                    <SelectItem value='ADMIN'>ADMIN</SelectItem>
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
                        <div className='col-span-2 flex items-end justify-stretch md:col-span-4 md:justify-end'>
                            <CreateUser onCreated={handleReload} />
                        </div>
                    </div>
                    <div className='bg-background overflow-hidden rounded-lg'>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className='text-center'>No</TableHead>
                                    <TableHead className='text-center'>Photo Profile</TableHead>
                                    <TableHead className='text-center'>Name</TableHead>
                                    <TableHead className='text-center'>Role</TableHead>
                                    <TableHead className='text-center'>Status</TableHead>
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
                                            <TableCell className='flex items-center'>
                                                <ProfilePicture
                                                    username={item.name}
                                                    image={item.photo}
                                                />
                                            </TableCell>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>{item.role}</TableCell>
                                            <TableCell>{item.status}</TableCell>
                                            <TableCell className='space-x-1 text-center'>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className='inline-block'>
                                                                <DetailUser user={item} />
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Detail</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className='inline-block'>
                                                                <UpdateUser
                                                                    user={item}
                                                                    onUpdated={handleReload}
                                                                />
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Edit</p>
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
