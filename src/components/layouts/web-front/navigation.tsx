'use client';
// import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/lib/i18n/navigation';
interface NavigationProps {
    layout: 'header' | 'sidebar' | 'footer';
    toggleSidebar?: () => void;
}

export default function Navigation({ layout, toggleSidebar }: NavigationProps) {
    // const t = useTranslations('common.navigation');
    const pathname = usePathname();

    const NAV_ITEMS = [
        { href: '/distros', label: 'Distro List' },
        { href: '/quiz', label: 'Quiz' },
        { href: '/about-us', label: 'About' },
        { href: '/privacy-policy', label: 'Privacy Policy' },
        { href: '/terms-conditions', label: 'Terms and Conditions' },
    ];

    const layoutClass =
        layout === 'header'
            ? 'flex items-center gap-6 px-6'
            : layout === 'sidebar'
              ? 'flex flex-col gap-y-8'
              : 'flex flex-col gap-y-2';

    const visibleItems =
        layout === 'footer'
            ? NAV_ITEMS
            : NAV_ITEMS.filter(
                  (item) => item.href !== '/privacy-policy' && item.href !== '/terms-conditions'
              );

    const isRouteActive = (href: string) =>
        pathname === href || pathname.startsWith(`${href}/`) || pathname.startsWith(`${href}?`);

    return (
        <nav>
            <ul className={`${layoutClass} gap-6`}>
                {visibleItems.map((item) => (
                    <li key={item.href}>
                        <Link
                            href={item.href}
                            onClick={layout === 'sidebar' ? toggleSidebar : undefined}
                            className={`hover:text-primary ${
                                isRouteActive(item.href) ? 'text-primary font-semibold' : ''
                            }`}
                        >
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
