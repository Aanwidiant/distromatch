'use client';

import React, { useState } from 'react';
import Sidebar from './sidebar';
import Footer from './footer';
import { useAuthStore } from '@/stores/auth-store';
import EmptyState from '@/components/globals/empty-state';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const [mobileVisible, setMobileVisible] = useState(false);
    const { user } = useAuthStore();

    const isAdmin = user?.role === 'ADMIN';

    if (!user || !isAdmin) {
        return <EmptyState variant='unauthorized' />;
    }

    return (
        <div className='flex h-screen overflow-hidden'>
            <Sidebar
                mobileVisible={mobileVisible}
                setMobileVisible={() => setMobileVisible(!mobileVisible)}
            />
            <div className='flex flex-1 flex-col overflow-hidden'>
                <main className='flex-1 overflow-y-auto'>{children}</main>
                <Footer />
            </div>
        </div>
    );
}
