'use client';

import AuthDialog from '@/components/globals/auth-modal';
import { Button } from '@/components/ui/button';
import { Mode } from '@/types';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface AuthActionProps {
    layout?: 'header' | 'sidebar';
}

export default function AuthAction({ layout = 'header' }: AuthActionProps) {
    const t = useTranslations('common.auth');

    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<Mode>('login');

    const handleOpenLogin = () => {
        setMode('login');
        setOpen(true);
    };

    const handleOpenRegister = () => {
        setMode('register');
        setOpen(true);
    };

    return (
        <div className={clsx('flex gap-2', layout === 'sidebar' && 'flex-col')}>
            <Button
                variant='outline'
                className={clsx('w-fit', layout === 'sidebar' && 'w-full')}
                onClick={handleOpenLogin}
            >
                {t('signIn')}
            </Button>
            <Button
                className={clsx('w-fit', layout === 'sidebar' && 'w-full')}
                onClick={handleOpenRegister}
            >
                {t('signUp')}
            </Button>

            <AuthDialog open={open} onOpenChange={setOpen} mode={mode} setMode={setMode} />
        </div>
    );
}
