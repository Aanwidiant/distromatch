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

export default function UserDropdown() {
    const { profile, logout } = useAuthStore();
    const profileDialog = useDialog('profile');

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
            <DropdownMenuContent align='end' className='w-44 space-y-1'>
                <DropdownMenuItem>Hasil Rekomendasi</DropdownMenuItem>
                <DropdownMenuItem onClick={profileDialog.open}>Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className='text-red'>
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
