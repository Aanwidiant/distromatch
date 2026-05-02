'use client';

import React, { useState } from 'react';
import Navbar from './navbar';
import Sidebar from './sidebar';
import Footer from './footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const [mobileVisible, setMobileVisible] = useState(false);

    return (
        <>
            <Navbar
                onMenuClick={() => setMobileVisible(!mobileVisible)}
                isSidebarOpen={mobileVisible}
            />
            <div className='flex h-screen overflow-hidden'>
                <Sidebar
                    mobileVisible={mobileVisible}
                    onMobileClose={() => setMobileVisible(false)}
                />
                <div className='flex flex-1 flex-col overflow-hidden pt-16'>
                    <main className='flex-1 overflow-y-auto'>{children}</main>
                    <Footer />
                </div>
            </div>
        </>
    );
}
