'use client';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/lib/i18n/navigation';
import { routing } from '@/lib/i18n/routing';
import { BoldArrowUp } from '../icons';

const languages: {
    code: (typeof routing.locales)[number];
    label: string;
    short: string;
}[] = [
    { code: 'en', label: 'English', short: 'Eng' },
    { code: 'id', label: 'Indonesia', short: 'Ind' },
];

export default function LanguageSwitcher() {
    const router = useRouter();
    const pathname = usePathname();
    const currentLang = useLocale();

    const activeLang = languages.find((l) => l.code === currentLang) ?? languages[0];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                asChild
                className='group flex h-fit w-fit cursor-pointer items-center'
            >
                <div className='text-foreground flex items-center gap-x-2'>
                    <p className='group-hover:text-primary'>{activeLang.short}</p>
                    <BoldArrowUp className='h-5 w-5 rotate-180 transition-transform duration-200 ease-out group-data-[state=open]:rotate-0' />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='z-50 space-y-1'>
                {languages.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onSelect={() => {
                            if (lang.code !== currentLang)
                                router.replace(pathname, { locale: lang.code });
                        }}
                        className={cn(
                            'w-full cursor-pointer rounded-md px-2.5 py-1.5 text-left text-sm',
                            lang.code === currentLang && 'bg-primary font-medium text-white'
                        )}
                    >
                        {lang.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
