'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Header from '@/components/layouts/admin/header';
import { Cpu, ImageOff, Search } from 'lucide-react';
import Fetch from '@/lib/fetch';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import Logo from '@/components/globals/logo';
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
import { toast } from 'sonner';
import ConfirmDelete from '@/components/globals/delete-confirm';
import CreateDistro from './components/create-distro';
import UpdateDistro from './components/update-distro';
import DetailDistro from './components/detail-distro';
import LogoDistro from './components/logo-distro';

type Distro = {
    id: number;
    name: string;
    slug: string;
    logo: string | null;
    status: string;
    total_reviews: number;
    overall_rating: string;
};

type Meta = {
    currentPage: number;
    pageSize: number;
    total: number;
    totalPages: number;
};

type Response = {
    success: boolean;
    data: Distro[];
    meta: Meta;
};

export default function AdminDistroPage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<Distro[]>([]);
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
    const [targetLevel, setTargetLevel] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('created_at');
    const [sortOrder, setSortOrder] = useState<string>('desc');

    const query = useMemo(() => {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('limit', String(limit));
        if (search) params.set('search', search);
        if (status !== 'all') params.set('status', status);
        if (targetLevel !== 'all') params.set('target_level', targetLevel);
        if (sortBy) params.set('sort_by', sortBy);
        if (sortOrder) params.set('sort_order', sortOrder);
        return params.toString();
    }, [page, limit, search, status, targetLevel, sortBy, sortOrder]);

    const fetchData = useCallback(async () => {
        try {
            const res = await Fetch.GET<Response>(`/distros/list?${query}`);
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

    const handleDelete = async (id: number) => {
        setLoading(true);
        try {
            const res = await Fetch.DELETE(`/distros/${id}`);
            if (res.success) {
                toast.success(res.message);
                await fetchData();
            } else {
                toast.error(res.message);
            }
        } catch {
            toast.error('Failed to delete distro.');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveLogo = async (id: number) => {
        setLoading(true);
        try {
            const res = await Fetch.DELETE(`/distros/logo/${id}`);
            if (res.success) {
                toast.success(res.message);
                await fetchData();
            } else {
                toast.error(res.message);
            }
        } catch {
            toast.error('Failed to delete distro logo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className='bg-bg-2'>
            <Header icon={<Cpu className='size-6' />} title='Distro' />
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
                                </SelectContent>
                            </Select>
                        </div>
                        <div className='space-y-1'>
                            <Label>Target Level</Label>
                            <Select
                                value={targetLevel}
                                onValueChange={(v) => {
                                    setLoading(true);
                                    setPage(1);
                                    setTargetLevel(v);
                                }}
                            >
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder='Target Level' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='all'>All</SelectItem>
                                    <SelectItem value='Beginner Friendly'>Beginner</SelectItem>
                                    <SelectItem value='Intermediate Experience Required'>
                                        Intermediate
                                    </SelectItem>
                                    <SelectItem value='Advanced Experience Required'>
                                        Advanced
                                    </SelectItem>
                                </SelectContent>
                            </Select>
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
                                    <SelectItem value='overall_rating'>Overall Rating</SelectItem>
                                    <SelectItem value='total_reviews'>Total Reviews</SelectItem>
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
                        <div className='col-span-2 flex items-end justify-end'>
                            <CreateDistro onCreated={handleReload} />
                        </div>
                    </div>
                    <div className='bg-background overflow-hidden rounded-lg'>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className='text-center'>No</TableHead>
                                    <TableHead className='text-center'>Logo</TableHead>
                                    <TableHead className='text-center'>Distro Name</TableHead>
                                    <TableHead className='text-center'>Status</TableHead>
                                    <TableHead className='text-center'>Overall Rating</TableHead>
                                    <TableHead className='text-center'>Total Reviews</TableHead>
                                    <TableHead className='text-center'>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={7}>Loading...</TableCell>
                                    </TableRow>
                                ) : data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7}>No data</TableCell>
                                    </TableRow>
                                ) : (
                                    data.map((item, idx) => (
                                        <TableRow key={item.id}>
                                            <TableCell className='text-center'>
                                                {(meta.currentPage - 1) * meta.pageSize + idx + 1}
                                            </TableCell>
                                            <TableCell>
                                                <Logo image={item.logo || ''} name={item.name} />
                                            </TableCell>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>{item.status}</TableCell>
                                            <TableCell>{item.overall_rating}</TableCell>
                                            <TableCell>{item.total_reviews}</TableCell>
                                            <TableCell className='space-x-1 text-center'>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className='inline-block'>
                                                                <DetailDistro slug={item.slug} />
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Detail</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className='inline-block'>
                                                                <LogoDistro
                                                                    id={item.id}
                                                                    onChanged={handleReload}
                                                                />
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Change Logo</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className='inline-block'>
                                                                <UpdateDistro
                                                                    slug={item.slug}
                                                                    onUpdated={handleReload}
                                                                />
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Edit</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className='inline-block'>
                                                                <ConfirmDelete
                                                                    icon={
                                                                        <ImageOff className='size-4' />
                                                                    }
                                                                    loading={loading}
                                                                    name={`${item.name} Logo`}
                                                                    title='Distro Logo'
                                                                    handleDelete={() =>
                                                                        handleRemoveLogo(item.id)
                                                                    }
                                                                />
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Delete Logo</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className='inline-block'>
                                                                <ConfirmDelete
                                                                    loading={loading}
                                                                    name={item.name}
                                                                    title='Distro'
                                                                    handleDelete={() =>
                                                                        handleDelete(item.id)
                                                                    }
                                                                />
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Delete</p>
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
