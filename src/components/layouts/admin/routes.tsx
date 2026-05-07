import type { FC, SVGProps } from 'react';
import { LayoutDashboard, Cpu, Settings, Users, Globe, SquareChartGantt } from 'lucide-react';

type SidebarItem = {
    label: string;
    icon: FC<SVGProps<SVGSVGElement>>;
    href?: string;
};

export const sidebarItems: SidebarItem[] = [
    {
        label: 'Dashboard',
        icon: LayoutDashboard,
        href: '/admin/dashboard',
    },
    {
        label: 'Distro',
        icon: Cpu,
        href: '/admin/distros',
    },
    {
        label: 'DSS Audit',
        icon: SquareChartGantt,
        href: '/admin/dss',
    },
    {
        label: 'System Settings',
        icon: Settings,
        href: '/admin/settings',
    },
    {
        label: 'User',
        icon: Users,
        href: '/admin/users',
    },
    {
        label: 'Go to Web',
        icon: Globe,
        href: '/',
    },
];
