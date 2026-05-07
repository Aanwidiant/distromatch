'use client';
import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function BackTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            setVisible(window.scrollY > 300);
        };
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className='group fixed right-6 bottom-6 z-50'>
            <button
                className={`bg-primary cursor-pointer rounded-full border p-2.5 transition-opacity duration-300 hover:shadow ${visible ? 'animate-bounce opacity-100 group-hover:animate-none' : 'pointer-events-none opacity-0'}`}
                onClick={scrollToTop}
            >
                <ArrowUp className='size-6 stroke-white group-hover:-translate-y-0.5 group-hover:scale-110' />
            </button>
        </div>
    );
}
