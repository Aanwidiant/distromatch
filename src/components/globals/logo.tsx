import Image from 'next/image';

type SizeVariant = 'sm' | 'md' | 'lg' | 'xl';

type LogoProps = {
    image?: string;
    name?: string;
    size?: string;
};

const sizeMap: Record<SizeVariant, { container: string; text: string }> = {
    sm: { container: 'size-12', text: 'text-sm' },
    md: { container: 'size-16', text: 'text-base' },
    lg: { container: 'size-20', text: 'text-xl' },
    xl: { container: 'size-24', text: 'text-3xl' },
};

export default function Logo({ image, name, size = 'sm' }: LogoProps & { size?: SizeVariant }) {
    const getInitial = () => (!name ? 'LX' : name.charAt(0).toUpperCase());
    const src = image ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/distros/${image}` : undefined;
    const { container, text } = sizeMap[size];

    return (
        <div
            className={`${container} bg-background flex shrink-0 items-center justify-center overflow-hidden rounded-lg border`}
        >
            {src ? (
                <Image
                    src={src}
                    alt={name || 'L'}
                    width={32}
                    height={32}
                    className='h-full w-full object-contain p-1'
                />
            ) : (
                <span className={`${text} font-semibold`}>{getInitial()}</span>
            )}
        </div>
    );
}
