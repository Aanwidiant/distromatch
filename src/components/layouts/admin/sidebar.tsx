import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { sidebarItems } from './routes';
import { ArrowRight } from 'lucide-react';

type SidebarProps = {
    mobileVisible: boolean;
    onMobileClose: () => void;
};

export default function Sidebar({ mobileVisible, onMobileClose }: SidebarProps) {
    const pathname = usePathname();

    const [collapsed, setCollapsed] = useState(false);
    const [isMdScreen, setIsMdScreen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const isMd = window.innerWidth >= 768;
            setIsMdScreen(isMd);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isActive = (href?: string) => {
        if (!href) return false;

        if (href === '/') {
            return pathname === '/';
        }

        return pathname.startsWith(href);
    };

    return (
        <>
            <div
                onClick={onMobileClose}
                className={`fixed inset-0 z-20 bg-black/30 transition-opacity md:hidden ${mobileVisible ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
            />

            <aside
                className={`bg-background fixed top-0 left-0 z-20 flex h-screen flex-col border border-r pt-16 transition-all md:relative md:translate-x-0 md:pt-16 ${mobileVisible ? 'w-56 translate-x-0' : 'w-56 -translate-x-full'} ${isMdScreen && collapsed ? 'md:w-16' : 'md:w-56'}`}
            >
                {/* Menu */}
                <div className='flex-1 overflow-y-auto px-2 py-4'>
                    <ul className='space-y-2'>
                        {sidebarItems.map(({ label, icon: Icon, href }) => {
                            const active = isActive(href);
                            return (
                                <li key={label}>
                                    <Link
                                        href={href || '#'}
                                        onClick={onMobileClose}
                                        className={`flex items-center rounded-lg px-3 py-2 transition-all ${collapsed ? 'md:justify-center' : 'gap-3'} ${
                                            active
                                                ? 'bg-primary text-white'
                                                : 'hover:bg-primary hover:text-white'
                                        }`}
                                    >
                                        <Icon
                                            className={`size-5 shrink-0 ${active ? 'stroke-white' : ''}`}
                                        />

                                        {((isMdScreen && !collapsed) || !isMdScreen) && (
                                            <span className='whitespace-nowrap'>{label}</span>
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <div className='hidden justify-end p-2 md:flex'>
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className='hover:bg-primary group rounded-md border p-2 transition'
                    >
                        <ArrowRight
                            className={`size-5 transition-transform ${collapsed ? 'rotate-0' : 'rotate-180'} group-hover:stroke-white`}
                        />
                    </button>
                </div>
            </aside>
        </>
    );
}
