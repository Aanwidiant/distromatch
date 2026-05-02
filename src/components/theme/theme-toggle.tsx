import { useSyncExternalStore } from 'react';
import { Moon, Sun } from '../icons';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { useThemeTransitionStore } from '@/stores/theme-transition-store';
import { motion, AnimatePresence } from 'framer-motion';

interface ThemeToggleProps {
    iconOnly?: boolean;
}

export default function ThemeToggle({ iconOnly = false }: ThemeToggleProps) {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const { startThemeTransition, endThemeTransition, isThemeAnimating } =
        useThemeTransitionStore();

    const t = useTranslations('common');

    const useIsMounted = () =>
        useSyncExternalStore(
            () => () => {},
            () => true,
            () => false
        );

    const mounted = useIsMounted();

    const currentTheme = theme === 'system' ? resolvedTheme : theme;

    const toggleTheme = () => {
        if (isThemeAnimating) return;

        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        startThemeTransition(newTheme === 'dark');

        setTimeout(() => {
            setTheme(newTheme);
        }, 350);

        setTimeout(() => {
            endThemeTransition();
        }, 800);
    };

    const iconButton = (
        <div className='bg-accent-2 w-fit rounded-full p-1'>
            <button
                onClick={toggleTheme}
                className='group hover:bg-primary dark:bg-primary flex cursor-pointer items-center justify-center rounded-full bg-white p-1 transition-colors dark:hover:bg-white'
                aria-label='Toggle Theme'
            >
                <AnimatePresence mode='wait'>
                    {mounted && currentTheme === 'light' ? (
                        <motion.div
                            key='sun'
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Sun className='fill-primary size-5 group-hover:fill-white' />
                        </motion.div>
                    ) : (
                        <motion.div
                            key='moon'
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Moon className='group-hover:fill-primary size-5 fill-white' />
                        </motion.div>
                    )}
                </AnimatePresence>
            </button>
        </div>
    );

    return iconOnly ? (
        iconButton
    ) : (
        <div
            className='bg-accent-2 relative m-3 flex h-9 w-40 cursor-pointer rounded-full p-1'
            onClick={toggleTheme}
        >
            <div
                className={`absolute left-1 h-7 w-20 rounded-full transition-transform duration-300 ${
                    mounted && currentTheme === 'dark'
                        ? 'bg-primary translate-x-0'
                        : 'translate-x-18 bg-white'
                }`}
            />

            <div className='z-10 flex h-7 w-20 items-center justify-center gap-2 p-2'>
                <Moon
                    className={`size-4 ${
                        mounted && currentTheme === 'dark' ? 'fill-light-white' : 'stroke-grey-3'
                    }`}
                />
                <p
                    className={`text-xs ${mounted && currentTheme === 'dark' ? 'text-white' : 'text-grey-3'}`}
                >
                    {t('dark')}
                </p>
            </div>

            <div className='z-10 flex h-7 w-20 items-center justify-center gap-2 p-2'>
                <Sun
                    className={`size-4 ${
                        mounted && currentTheme === 'light' ? 'fill-primary' : 'fill-grey-3'
                    }`}
                />
                <p
                    className={`text-xs ${mounted && currentTheme === 'light' ? 'text-primary' : 'text-grey-3'}`}
                >
                    {t('light')}
                </p>
            </div>
        </div>
    );
}
