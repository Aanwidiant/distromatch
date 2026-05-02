import { useEffect, useRef, useState } from 'react';

function easeOutCubic(t: number) {
    return 1 - Math.pow(1 - t, 3);
}

export default function useAnimatedNumber(target: number, duration = 600) {
    const [displayValue, setDisplayValue] = useState(target);

    const startValue = useRef(target);
    const currentValue = useRef(target);
    const startTime = useRef<number | null>(null);
    const rafId = useRef<number | null>(null);

    useEffect(() => {
        startValue.current = currentValue.current;
        startTime.current = null;

        const step = (timestamp: number) => {
            if (!startTime.current) startTime.current = timestamp;

            const elapsed = timestamp - startTime.current;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeOutCubic(progress);

            const next = startValue.current + (target - startValue.current) * eased;

            currentValue.current = next;
            setDisplayValue(next);

            if (progress < 1) {
                rafId.current = requestAnimationFrame(step);
            }
        };

        rafId.current = requestAnimationFrame(step);

        return () => {
            if (rafId.current) {
                cancelAnimationFrame(rafId.current);
            }
        };
    }, [target, duration]);

    return Math.round(displayValue);
}
