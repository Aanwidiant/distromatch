'use client';

import ThemeToggle from '../../theme/theme-toggle';
import LanguageSwitcher from '../../globals/locale-dropdown';
import Navigation from './navigation';
import HamburgerMenu from './hamburger';
import { LogoFull } from '../../icons';
import { Link } from '@/lib/i18n/navigation';
import UserDropdown from '@/components/globals/user-dropdown';
import AuthAction from './auth-action';
import { useAuthStore } from '@/stores/auth-store';

interface HeaderProps {
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}

export default function Header({ isSidebarOpen, toggleSidebar }: HeaderProps) {
    const { isAuthenticated } = useAuthStore();

    return (
        <header className='bg-background/80 sticky top-0 z-20 px-6 shadow-xs backdrop-blur lg:px-18'>
            <div className='flex min-h-16 w-full items-center justify-between'>
                <Link href={`/`}>
                    <LogoFull className='h-fit w-36' />
                </Link>

                <div className='hidden items-center gap-3 lg:flex'>
                    <Navigation layout='header' />

                    <div className='flex items-center gap-3'>
                        <LanguageSwitcher />
                        <ThemeToggle iconOnly={true} />
                    </div>
                    <div className='bg-stroke mx-2 hidden h-6 w-px lg:block' />
                    {isAuthenticated ? <UserDropdown /> : <AuthAction />}
                </div>
                <div className='flex h-full items-center p-4 lg:hidden'>
                    <HamburgerMenu isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                </div>
            </div>
        </header>
    );
}
