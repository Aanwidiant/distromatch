'use client';

import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { useTranslations } from 'next-intl';

export default function SearchDistro({ defaultValue }: { defaultValue: string }) {
    const router = useRouter();
    const t = useTranslations('distro');

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
                    placeholder={t('searchDistro')}
                />
                <InputGroupAddon>
                    <Search />
                </InputGroupAddon>
            </InputGroup>
        </form>
    );
}
