import React from 'react';
import NavLayout from './nav-layout';
import Footer from './footer';
import BackTop from './back-top';

export default function WebFrontLayout({ children }: { children: React.ReactNode }) {
    return (
        <NavLayout>
            <main>{children}</main>
            <Footer />
            <BackTop />
        </NavLayout>
    );
}
