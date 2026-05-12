import Image from 'next/image';

const VALUE_EMOJIS: Record<number, string> = {
    1: '/emoji/not-important.svg',
    2: '/emoji/less-important.svg',
    3: '/emoji/quite-important.svg',
    4: '/emoji/important.svg',
    5: '/emoji/very-important.svg',
};

type Props = {
    value: number;
    label: string;
    selected: boolean;
    onClick: () => void;
};

export default function AnswerOption({ value, label, selected, onClick }: Props) {
    return (
        <button
            type='button'
            onClick={onClick}
            className={`group relative w-full rounded-xl border px-4 py-4 text-center transition-all duration-200 ${
                selected
                    ? 'bg-primary border-primary text-white'
                    : 'bg-bg-2 text-grey-2 border-stroke hover:bg-accent-1 hover:border-primary/30 hover:text-foreground'
            } `}
        >
            <div className='flex items-center gap-3 md:flex-col md:justify-center md:gap-2'>
                <span
                    className={`flex size-12 items-center justify-center rounded-full transition-all ${selected ? 'bg-white/20' : 'bg-accent-1 group-hover:bg-accent-2'} `}
                >
                    {VALUE_EMOJIS[value] ? (
                        <Image
                            src={VALUE_EMOJIS[value]}
                            alt={`Nilai ${value}`}
                            width={32}
                            height={32}
                            className='size-12'
                        />
                    ) : (
                        <span className='text-grey-3 font-mono text-sm font-bold'>{value}</span>
                    )}
                </span>
                <span className='text-sm leading-snug font-medium md:text-center'>{label}</span>
            </div>
        </button>
    );
}
