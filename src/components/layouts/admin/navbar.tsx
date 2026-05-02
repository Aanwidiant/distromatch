import HamburgerMenu from '../web-front/hamburger';

export default function Navbar({
    onMenuClick,
    isSidebarOpen,
}: {
    onMenuClick: () => void;
    isSidebarOpen: boolean;
}) {
    return (
        <nav className='bg-light border-gray fixed top-0 z-30 flex h-16 w-full items-center border-b px-6'>
            <div className='flex items-center justify-start'>
                <div className='scale-75 items-center p-2 md:hidden'>
                    <HamburgerMenu isOpen={isSidebarOpen} toggleSidebar={onMenuClick} />
                </div>
                <p className='text-primary text-2xl font-bold tracking-widest'>KOLABRY</p>
            </div>
        </nav>
    );
}
