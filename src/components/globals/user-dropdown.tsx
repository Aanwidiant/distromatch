'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ProfilePicture from './profile-picture';
import { useAuthStore } from '@/stores/auth-store';
import Fetch from '@/lib/fetch';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { LogoutResponse } from '@/types';
import { useDialog } from '@/hooks/use-dialog';
import { useRouter } from '@/lib/i18n/navigation';
import { SquareChartGantt, User, LogOut, ShieldUser } from 'lucide-react';
import Link from 'next/link';

export default function UserDropdown() {
    const { user, profile, logout } = useAuthStore();
    const profileDialog = useDialog('profile');
    const router = useRouter();
    const isAdmin = user?.role === 'ADMIN';

    const handleLogout = async () => {
        try {
            await Fetch.DELETE<LogoutResponse>('/auth/logout');
            logout();
            toast.success('Logout berhasil');
        } catch (err) {
            let message = 'Gagal logout';

            if (err instanceof AxiosError) {
                const data = err.response?.data as { message?: string } | undefined;
                message = data?.message ?? err.message;
            } else if (err instanceof Error) {
                message = err.message;
            }
            toast.error(message);
            logout();
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className='flex h-fit w-fit cursor-pointer items-center'>
                    <ProfilePicture
                        username={profile?.username}
                        image={profile?.photo ?? undefined}
                    />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='bg-background w-fit min-w-44 space-y-1'>
                {isAdmin && (
                    <DropdownMenuItem asChild>
                        <Link href='/admin/dashboard' className='flex items-center gap-2'>
                            <ShieldUser className='size-4' />
                            Admin Dashboard
                        </Link>
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem
                    onClick={() => router.push(`/${profile?.username}/results`)}
                    className='flex items-center gap-2'
                >
                    <SquareChartGantt className='size-4' />
                    Hasil Rekomendasi
                </DropdownMenuItem>
                <DropdownMenuItem onClick={profileDialog.open} className='flex items-center gap-2'>
                    <User className='size-4' />
                    Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={handleLogout}
                    className='flex items-center gap-2 text-red-500'
                >
                    <LogOut className='size-4' />
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
