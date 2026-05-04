import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

type ProfilePictureProps = {
    image?: string;
    username?: string;
    size?: string;
};

type SizeVariant = 'sm' | 'md' | 'lg' | 'xl';

const sizeMap: Record<SizeVariant, { container: string; text: string }> = {
    sm: { container: 'h-8 w-8', text: 'text-sm' },
    md: { container: 'h-10 w-10', text: 'text-base' },
    lg: { container: 'h-16 w-16', text: 'text-xl' },
    xl: { container: 'h-24 w-24', text: 'text-3xl' },
};

export default function ProfilePicture({
    image,
    username,
    size = 'sm',
}: ProfilePictureProps & { size?: SizeVariant }) {
    const getInitial = () => {
        if (!username) return 'G';
        return username.charAt(0).toUpperCase();
    };

    const baseUrl = process.env.NEXT_PUBLIC_IMAGE_URL;
    const src = image ? `${baseUrl}/avatars/${image}` : undefined;

    const { container, text } = sizeMap[size];

    return (
        <Avatar className={container}>
            {src && <AvatarImage src={src} alt={username || 'Guest'} />}
            <AvatarFallback className={`flex items-center justify-center ${text}`}>
                {getInitial()}
            </AvatarFallback>
        </Avatar>
    );
}
