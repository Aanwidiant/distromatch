import { Instagram, Facebook, Youtube } from '@/components/icons';

const ICON_CLASS = 'fill-white group-hover:fill-primary';

const ITEM_CLASS =
    'group flex size-10 items-center justify-center rounded-full border hover:bg-background border-primary bg-primary';

const SOCIAL_LINKS = {
    facebook: 'https://web.facebook.com/',
    youtube: 'https://www.youtube.com/',
    instagram: 'https://www.instagram.com/',
};

export default function SocialMedia() {
    return (
        <div className='flex items-center gap-3'>
            <a
                href={SOCIAL_LINKS.facebook}
                target='_blank'
                rel='noopener noreferrer'
                aria-label='Facebook'
                className={ITEM_CLASS}
            >
                <Facebook className={`${ICON_CLASS} size-5`} />
            </a>

            <a
                href={SOCIAL_LINKS.youtube}
                target='_blank'
                rel='noopener noreferrer'
                aria-label='YouTube'
                className={ITEM_CLASS}
            >
                <Youtube className={`${ICON_CLASS} size-6`} />
            </a>

            <a
                href={SOCIAL_LINKS.instagram}
                target='_blank'
                rel='noopener noreferrer'
                aria-label='Instagram'
                className={ITEM_CLASS}
            >
                <Instagram className={`${ICON_CLASS} size-6`} />
            </a>
        </div>
    );
}
