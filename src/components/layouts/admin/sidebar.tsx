'use client';

import Link from 'next/link';
import { ChecklistCircle } from '@/components/icons';
import { usePathname } from 'next/navigation';

type SidebarProps = {
    mobileVisible: boolean;
    onMobileClose: () => void;
};

const sidebarItems = [
    { label: 'Dashboard', icon: ChecklistCircle, href: '/dashboard' },
    { label: 'Report', icon: ChecklistCircle, href: '/reports' },
    { label: 'User', icon: ChecklistCircle, href: '/users' },
];

export default function Sidebar({ mobileVisible, onMobileClose }: SidebarProps) {
    const pathname = usePathname();

    return (
        <>
            <div
                onClick={onMobileClose}
                className={`bg-dark/10 fixed inset-0 z-20 transition-opacity md:hidden ${
                    mobileVisible
                        ? 'pointer-events-auto opacity-100'
                        : 'pointer-events-none opacity-0'
                }`}
            />

            <aside
                className={`bg-light border-gray fixed top-0 left-0 z-20 h-screen w-56 border-r pt-19 transition-all md:relative md:translate-x-0 ${
                    mobileVisible ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className='custom-scroll h-full overflow-y-auto px-2'>
                    <ul className='space-y-2 font-medium'>
                        {sidebarItems.map(({ label, icon: Icon, href }) => (
                            <li key={label}>
                                <Link
                                    href={href}
                                    onClick={onMobileClose}
                                    className={`group flex items-center space-x-3 rounded-lg p-2 ${
                                        pathname === href
                                            ? 'bg-primary text-light'
                                            : 'text-dark hover:bg-primary hover:text-dark'
                                    }`}
                                >
                                    <Icon className='group-hover:fill-light h-6 w-6 fill-current' />
                                    <span className='whitespace-nowrap group-hover:text-white'>
                                        {label}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>
        </>
    );
}
