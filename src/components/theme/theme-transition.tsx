'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { LogoFill } from '@/components/icons';
import { useThemeTransitionStore } from '@/stores/theme-transition-store';

export default function ThemeTransition() {
    const isAnimating = useThemeTransitionStore((s) => s.isThemeAnimating);
    const toDark = useThemeTransitionStore((s) => s.toDark);

    return (
        <AnimatePresence>
            {isAnimating && (
                <>
                    <motion.div
                        className='fixed inset-0 z-50'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.div
                            className='absolute inset-0'
                            initial={{ clipPath: 'circle(0% at 50% 50%)' }}
                            animate={{ clipPath: 'circle(150% at 50% 50%)' }}
                            exit={{ clipPath: 'circle(0% at 50% 50%)' }}
                            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                            style={{ background: toDark ? '#0F0F14' : '#FFFFFF' }}
                        />
                    </motion.div>

                    <motion.div
                        className='fixed inset-0 z-50 flex items-center justify-center'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{
                            background: toDark ? 'rgba(255,255,255,0.16)' : 'rgba(0,0,0,0.16)',
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 8 }}
                            exit={{ opacity: 0 }}
                            transition={{
                                duration: 0.65,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                            className='relative flex items-center justify-center rounded-full'
                            style={{ width: 120, height: 120 }}
                        >
                            <motion.div
                                initial={{ scale: 1, opacity: 1 }}
                                animate={{ scale: 1.8, opacity: 0.5 }}
                                transition={{ duration: 0.45, ease: 'easeOut' }}
                            >
                                <LogoFill className='text-primary size-12' />
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
