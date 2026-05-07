'use client';
import Navigation from './navigation';
import SocialMedia from './social-media';
import { Link } from '@/lib/i18n/navigation';
import { useTranslations } from 'next-intl';
import { LogoFull } from '@/components/icons';

export default function Footer() {
    const t = useTranslations('common');
    const currentYear = new Date().getFullYear();

    return (
        <footer className='w-full'>
            <div className='flex flex-col gap-8 p-6 lg:flex-row lg:justify-between lg:px-20'>
                <div className='flex flex-col gap-4 lg:w-1/2'>
                    <Link href='/'>
                        <LogoFull className='h-fit w-36' />
                    </Link>
                    <p className='max-w-md text-sm'>Stop Guessing. Start Matching.</p>
                    <SocialMedia />
                </div>

                <div className='flex flex-col gap-8 lg:w-1/2 lg:flex-row'>
                    <div className='space-y-4 lg:w-1/2'>
                        <h2 className='text-primary text-lg font-semibold'>
                            {t('navigation.title')}
                        </h2>
                        <Navigation layout='footer' />
                    </div>

                    <div className='space-y-4 lg:w-1/2'>
                        <h2 className='text-primary text-lg font-semibold'>{t('contact.title')}</h2>

                        <div className='space-y-2'>
                            <div className='space-y-1'>
                                <p className='font-semibold'>Messages</p>
                                <Link
                                    href='/about-us#message'
                                    className='text-primary font-medium hover:underline'
                                >
                                    click here
                                </Link>
                            </div>
                            <div className='space-y-1'>
                                <p className='font-semibold'>{t('contact.email')}</p>
                                <a
                                    href='mailto:info@distromatch.tech'
                                    className='hover:text-primary hover:underline'
                                >
                                    info@distromatch.tech
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='text-grey-2 flex justify-center border-t px-6 py-4 text-xs'>
                © {currentYear} Distromatch. {t('footer.allRightsReserved')}
            </div>
        </footer>
    );
}
