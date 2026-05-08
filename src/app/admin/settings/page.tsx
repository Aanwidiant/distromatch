'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Header from '@/components/layouts/admin/header';
import { Settings, Search } from 'lucide-react';
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
import { toast } from 'sonner';
import ConfirmDelete from '@/components/globals/delete-confirm';
import ProfilePicture from '@/components/globals/profile-picture';
import { formatDateTime } from '@/lib/formate-date';
import CreateSetting from './components/create-setting';
import UpdateSetting from './components/update-setting';
import DetailSetting from './components/detail-setting';

type SystemSetting = {
    id: number;
    name: string;
    status: string;
    updated_by: string;
    updated_by_name: string;
    updated_by_photo: string;
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
    data: SystemSetting[];
    meta: Meta;
};

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<SystemSetting[]>([]);
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

    const query = useMemo(() => {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('limit', String(limit));
        if (search) params.set('search', search);
        if (status !== 'all') params.set('status', status);
        return params.toString();
    }, [page, limit, search, status]);

    const fetchData = useCallback(async () => {
        try {
            const res = await Fetch.GET<Response>(`/system/list?${query}`);
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
            const res = await Fetch.DELETE(`/system/${id}`);
            if (res.success) {
                toast.success(res.message);
                await fetchData();
            } else {
                toast.error(res.message);
            }
        } catch {
            toast.error('Failed to delete system setting.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main>
            <Header icon={<Settings className='size-6' />} title='System Settings' />
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
                        <div className='col-span-2 flex items-end justify-stretch md:col-span-1 md:justify-end'>
                            <CreateSetting onCreated={handleReload} />
                        </div>
                    </div>
                    <div className='bg-background overflow-hidden rounded-lg'>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className='text-center'>No</TableHead>
                                    <TableHead className='text-center'>Name</TableHead>
                                    <TableHead className='text-center'>Status</TableHead>
                                    <TableHead className='text-center'>Owner</TableHead>
                                    <TableHead className='text-center'>Last Updated At</TableHead>
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
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>{item.status}</TableCell>
                                            <TableCell className='flex items-center gap-3'>
                                                <ProfilePicture
                                                    username={item.updated_by_name}
                                                    image={item.updated_by_photo}
                                                />
                                                <span>{item.updated_by_name}</span>
                                            </TableCell>
                                            <TableCell>{formatDateTime(item.updated_at)}</TableCell>
                                            <TableCell className='space-x-1 text-center'>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className='inline-block'>
                                                                <DetailSetting id={item.id} />
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Detail</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className='inline-block'>
                                                                <UpdateSetting
                                                                    id={item.id}
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
                                                                    loading={loading}
                                                                    name={item.name}
                                                                    title='System Setting'
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
