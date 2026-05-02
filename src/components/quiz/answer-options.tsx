const VALUE_EMOJIS: Record<number, string> = {
    1: '😑',
    2: '😐',
    3: '🙂',
    4: '😊',
    5: '🤩',
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
            <div className='flex flex-col items-center gap-2'>
                <span
                    className={`flex size-8 items-center justify-center rounded-full font-mono text-sm font-bold transition-all ${selected ? 'bg-white/20 text-white' : 'bg-accent-1 text-grey-3 group-hover:bg-accent-2'} `}
                >
                    {VALUE_EMOJIS[value] ?? value}
                </span>
                <span className='text-sm leading-snug font-medium'>{label}</span>
            </div>
        </button>
    );
}
