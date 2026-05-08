interface HeaderProps {
    icon: React.ReactNode;
    title: string;
}

export default function Header({ icon, title }: HeaderProps) {
    return (
        <header className='bg-background/80 sticky top-0 z-10 border-b px-6 shadow-xs backdrop-blur'>
            <div className='flex min-h-12 w-full items-center gap-3'>
                {icon}
                <p>{title}</p>
            </div>
        </header>
    );
}
