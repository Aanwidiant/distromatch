'use client';

import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';

export default function SearchDistro({ defaultValue }: { defaultValue: string }) {
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const search = (form.elements.namedItem('search') as HTMLInputElement).value.trim();
        const q = new URLSearchParams({ page: '1' });
        if (search) q.set('search', search);
        router.push(`?${q.toString()}`);
    };

    return (
        <form onSubmit={handleSubmit} className='flex items-center gap-2'>
            <InputGroup className='max-w-xs'>
                <InputGroupInput
                    name='search'
                    defaultValue={defaultValue}
                    placeholder='Search distro...'
                />
                <InputGroupAddon>
                    <Search />
                </InputGroupAddon>
            </InputGroup>
        </form>
    );
}
