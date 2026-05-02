import { Dispatch, SetStateAction } from 'react';

interface MenuProps {
    isOpen: boolean;
    toggleSidebar: Dispatch<SetStateAction<boolean>>;
}

export default function HamburgerMenu({ isOpen, toggleSidebar }: MenuProps) {
    return (
        <button
            className='flex cursor-pointer flex-col items-center justify-center gap-y-1.5'
            onClick={() => toggleSidebar((prev) => !prev)}
            aria-label='Toggle Sidebar'
        >
            <span
                className={`bg-foreground h-0.5 w-6 origin-top-left transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-1.25 rotate-45' : ''}`}
            />
            <span
                className={`bg-foreground h-0.5 w-6 transition-transform duration-300 ease-in-out ${isOpen ? 'scale-0' : ''}`}
            />
            <span
                className={`bg-foreground h-0.5 w-6 origin-bottom-left transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-1.25 -rotate-45' : ''}`}
            />
        </button>
    );
}
