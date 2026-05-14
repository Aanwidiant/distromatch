'use client';

import React, { useState } from 'react';
import Fetch from '@/lib/fetch';
import { ChevronRight, CircleUserRound, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ProfilePicture from '@/components/globals/profile-picture';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { useAuthStore } from '@/stores/auth-store';
import { Input } from '../ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group';
import { useDialog } from '@/hooks/use-dialog';
import { useTranslations } from 'next-intl';

export default function ProfileModal() {
    const t = useTranslations('common.profile');
    const { isOpen, close } = useDialog('profile');
    const deleteDialog = useDialog('deleteAccount');
    const changePassword = useDialog('changePassword');
    const changeEmail = useDialog('changeEmail');
    const deletePhoto = useDialog('deletePhoto');
    const changePhoto = useDialog('changePhoto');
    const { profile, updateProfile } = useAuthStore();

    const [draftName, setDraftName] = useState('');
    const [dangerOpen, setDangerOpen] = useState(false);
    const [isChanged, setIsChanged] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const currentName = isChanged ? draftName : (profile?.name ?? '');
    const currentUsername = profile?.username ?? '';
    const currentEmail = profile?.email ?? '';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setDraftName(value);
        setIsChanged(true);
    };

    const handleSave = async () => {
        if (!currentName.trim()) {
            toast.error(t('form.validation.nameRequired'));
            return;
        }
        setIsLoading(true);

        try {
            const res = await Fetch.PATCH('/users', {
                name: currentName,
            });
            if (res.success) {
                toast.success(res.message);
                updateProfile({
                    name: currentName,
                });
                setIsChanged(false);
            } else {
                toast.error(res.message);
            }
        } catch {
            toast.error(t('notifications.failed'));
        } finally {
            setIsLoading(false);
        }
    };

    const clearNameChange = () => {
        setDraftName('');
        setIsChanged(false);
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            close();
            setDangerOpen(false);
            setDraftName('');
            setIsChanged(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className='w-full max-w-md overflow-y-auto md:max-w-2xl'>
                <DialogHeader>
                    <DialogTitle className='flex items-center gap-2'>
                        <CircleUserRound className='size-6' /> <span>{t('title')}</span>
                    </DialogTitle>
                </DialogHeader>
                <div className='no-scrollbar max-h-[80vh] space-y-6 overflow-y-auto'>
                    <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                        <div className='flex items-center gap-4'>
                            <ProfilePicture
                                image={profile?.photo ?? undefined}
                                username={profile?.username}
                                size='xl'
                            />
                            <div>
                                <p className='text-sm font-semibold'>{t('photoSection.label')}</p>
                                <p className='text-xs'>{t('photoSection.hint')}</p>
                            </div>
                        </div>
                        <div className='flex flex-wrap gap-2 sm:justify-end'>
                            <Button variant='outline' onClick={changePhoto.open}>
                                {t('photoSection.change')}
                            </Button>
                            <Button variant='destructive' onClick={deletePhoto.open}>
                                {t('photoSection.delete')}
                            </Button>
                        </div>
                    </div>
                    <div className='bg-muted/10 space-y-4 rounded-lg border p-5'>
                        <div className='grid gap-2 sm:grid-cols-[160px_1fr] sm:items-center'>
                            <label className='text-sm font-medium' htmlFor='name'>
                                {t('form.name')}
                            </label>
                            <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
                                <InputGroup>
                                    <InputGroupInput
                                        id='name'
                                        name='name'
                                        value={currentName}
                                        onChange={handleChange}
                                    />
                                    {isChanged && (
                                        <InputGroupAddon align='inline-end' className='pr-4'>
                                            <button
                                                type='button'
                                                onClick={clearNameChange}
                                                disabled={isLoading}
                                                aria-label='Clear name changes'
                                            >
                                                <X className='size-5' />
                                            </button>
                                        </InputGroupAddon>
                                    )}
                                </InputGroup>
                                <Button onClick={handleSave} disabled={isLoading || !isChanged}>
                                    {isLoading ? t('form.buttons.saving') : t('form.buttons.save')}
                                </Button>
                            </div>
                        </div>
                        <div className='grid gap-2 sm:grid-cols-[160px_1fr] sm:items-center'>
                            <label className='text-sm font-medium'>{t('form.username')}</label>
                            <Input value={currentUsername} disabled />
                        </div>
                        <div className='grid gap-2 sm:grid-cols-[160px_1fr] sm:items-center'>
                            <label className='text-sm font-medium'>{t('form.email')}</label>
                            <Input value={currentEmail} disabled />
                        </div>
                        <div className='flex flex-wrap justify-end gap-3'>
                            <Button
                                variant='outline'
                                onClick={changeEmail.open}
                                className='w-full md:w-fit'
                            >
                                {t('form.buttons.changeEmail')}
                            </Button>
                            <Button onClick={changePassword.open} className='w-full md:w-fit'>
                                {t('form.buttons.changePassword')}
                            </Button>
                        </div>
                    </div>
                    <div className='space-y-2 border-t pt-4'>
                        <button
                            onClick={() => setDangerOpen(!dangerOpen)}
                            className='text-red flex items-center gap-2 font-semibold'
                        >
                            <ChevronRight
                                className={`h-5 w-5 transition ${dangerOpen ? 'rotate-90' : ''}`}
                            />
                            {t('dangerZone.title')}
                        </button>
                        {dangerOpen && (
                            <div className='border-red bg-red/5 flex justify-center rounded-md border p-4'>
                                <Button variant='destructive' onClick={deleteDialog.open}>
                                    {t('dangerZone.button')}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
