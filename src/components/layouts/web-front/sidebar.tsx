import LanguageSwitcher from '@/components/globals/locale-dropdown';
import Navigation from './navigation';
import ThemeToggle from '@/components/theme/theme-toggle';
import AuthAction from './auth-action';
import { useAuthStore } from '@/stores/auth-store';

interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
    const { isAuthenticated } = useAuthStore();

    return (
        <div>
            <div
                className={`bg-background/80 fixed top-16 right-0 z-40 h-[calc(100vh-4rem)] w-1/2 transform shadow-xs backdrop-blur transition-transform duration-500 ease-in-out lg:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'} `}
            >
                <div className='flex h-full flex-col gap-8 px-8 py-6'>
                    <Navigation layout='sidebar' toggleSidebar={toggleSidebar} />
                    <LanguageSwitcher />
                    {!isAuthenticated && <AuthAction layout='sidebar' />}
                    <div className='mt-auto flex justify-center'>
                        <ThemeToggle />
                    </div>
                </div>
            </div>
            {isOpen && <div className='fixed inset-0 z-30 lg:hidden' onClick={toggleSidebar} />}
        </div>
    );
}
