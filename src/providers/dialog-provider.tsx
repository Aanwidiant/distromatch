'use client';

import ConfirmDeleteAccount from '@/components/user-settings/delete-account';
import ProfileModal from '@/components/user-settings/profile-modal';
import ChangePassword from '@/components/user-settings/change-password';
import ChangeEmail from '@/components/user-settings/change-email';
import ConfirmDeletePhoto from '@/components/user-settings/delete-photo';
import ChangeProfilePicture from '@/components/user-settings/change-profile';

export default function DialogProvider() {
    return (
        <>
            <ProfileModal />
            <ConfirmDeleteAccount />
            <ChangePassword />
            <ChangeEmail />
            <ConfirmDeletePhoto />
            <ChangeProfilePicture />
        </>
    );
}
