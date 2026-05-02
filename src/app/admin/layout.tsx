import ClientLayout from '@/components/layouts/admin/client-layout';
import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
    return <ClientLayout>{children}</ClientLayout>;
}
