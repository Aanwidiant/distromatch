import React from 'react';
import NavLayout from './nav-layout';
import Footer from './footer';
import BackTop from './back-top';

export default function WebFrontLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='container mx-auto'>
            <NavLayout>
                <main className='p-6 md:p-16'>{children}</main>
                <Footer />
                <BackTop />
            </NavLayout>
        </div>
    );
}
