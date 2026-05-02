'use client';

import React, { useState } from 'react';
import Fetch from '@/lib/fetch';
import { Eye, EyeOff, KeyRound } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group';
import { useAuthStore } from '@/stores/auth-store';
import { useDialog } from '@/hooks/use-dialog';

export default function ChangePassword() {
    const { profile, logout } = useAuthStore();
    const { isOpen, close, closeAll } = useDialog('changePassword');

    const isGoogle = profile?.provider === 'google';

    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()[\]{}\-_=+|\\/.,:;]).{8,}$/;

    const [formData, setFormData] = useState({
        current_password: '',
        password: '',
        confirm_password: '',
    });

    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const isPasswordWeak = formData.password.length > 0 && !passwordRegex.test(formData.password);

    const isConfirmMismatch =
        formData.confirm_password.length > 0 && formData.password !== formData.confirm_password;

    const resetState = () => {
        setFormData({
            current_password: '',
            password: '',
            confirm_password: '',
        });
        setLoading(false);
    };

    const handleClose = () => {
        resetState();
        close();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        const { current_password, password, confirm_password } = formData;

        if (!password || !confirm_password) {
            toast.error('All required fields must be filled.');
            return;
        }

        if (!isGoogle && !current_password) {
            toast.error('Current password is required.');
            return;
        }

        if (password !== confirm_password) {
            toast.error('Password confirmation does not match.');
            return;
        }

        setLoading(true);

        try {
            const payload: {
                newPassword: string;
                oldPassword?: string;
            } = {
                newPassword: password,
            };

            if (!isGoogle) {
                payload.oldPassword = current_password;
            }

            const res = await Fetch.POST('/auth/password/change', payload);

            if (res.success) {
                toast.success(res.message);
                handleClose();
                logout();
                closeAll();
            } else {
                toast.error(res.message);
            }
        } catch {
            toast.error('Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    const renderPasswordField = (
        label: string,
        name: 'current_password' | 'password' | 'confirm_password',
        key: keyof typeof showPassword
    ) => (
        <div className='flex flex-col gap-2'>
            <label className='font-medium'>{label}</label>
            <InputGroup>
                <InputGroupInput
                    type={showPassword[key] ? 'text' : 'password'}
                    name={name}
                    placeholder={label}
                    value={formData[name]}
                    onChange={handleChange}
                />
                <InputGroupAddon align='inline-end' className='pr-4'>
                    <button
                        type='button'
                        onClick={() =>
                            setShowPassword((prev) => ({
                                ...prev,
                                [key]: !prev[key],
                            }))
                        }
                    >
                        {showPassword[key] ? (
                            <EyeOff className='size-5' />
                        ) : (
                            <Eye className='size-5' />
                        )}
                    </button>
                </InputGroupAddon>
            </InputGroup>
        </div>
    );

    return (
        <Dialog open={isOpen} onOpenChange={(v) => !v && handleClose()}>
            <DialogContent className='w-full max-w-md md:max-w-lg'>
                <DialogHeader>
                    <DialogTitle className='flex items-center gap-2'>
                        <KeyRound className='size-6' />
                        Change Password
                    </DialogTitle>
                </DialogHeader>

                <div className='flex flex-col gap-3'>
                    {!isGoogle &&
                        renderPasswordField('Current Password', 'current_password', 'current')}

                    <div className='flex flex-col gap-2'>
                        {renderPasswordField('New Password', 'password', 'new')}
                        {isPasswordWeak && (
                            <span className='text-red text-sm'>
                                Password minimal 8 karakter dan harus mengandung huruf besar, huruf
                                kecil, angka, serta karakter spesial.
                            </span>
                        )}
                    </div>

                    <div className='flex flex-col gap-2'>
                        {renderPasswordField('Confirm New Password', 'confirm_password', 'confirm')}
                        {isConfirmMismatch && (
                            <span className='text-red text-sm'>
                                Konfirmasi password tidak sesuai.
                            </span>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant='outline' onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={
                            loading ||
                            isPasswordWeak ||
                            isConfirmMismatch ||
                            !formData.password ||
                            !formData.confirm_password
                        }
                    >
                        {loading ? 'Updating...' : 'Update Password'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
