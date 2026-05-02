'use client';
import React, { useState } from 'react';
import Header from './header';
import Sidebar from './sidebar';

export default function NavLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
        <>
            <Header
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={() => setSidebarOpen((prev) => !prev)}
            />
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setSidebarOpen(false)} />
            {children}
        </>
    );
}
