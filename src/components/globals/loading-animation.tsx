'use client';

import React, { useEffect, useRef } from 'react';

interface LoadingAnimationProps {
    size?: number;
    showLoadingText?: boolean;
    text?: string;
}

const PATH_1 =
    'M139.576 222.83L138.923 222.769C111.322 220.002 91.0002 195.544 93.4248 167.829C95.8688 139.897 120.494 119.235 148.426 121.679L139.576 222.83Z';
const PATH_2 =
    'M183.986 94.85L210.457 82.5634L199.134 211.981C198.364 220.784 190.603 227.296 181.801 226.526L147.162 223.495L159.884 78.0889L159.969 78.0964L183.986 94.85Z';

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({
    size = 128,
    showLoadingText = true,
    text,
}) => {
    const strokeColor = '#0086FF';
    const loopDuration = 0.75;

    const pathRefs = useRef<SVGPathElement[]>([]);
    const rafRef = useRef<number | null>(null);
    const [fillVisible, setFillVisible] = React.useState(false);

    const strokeWidth = Math.max(2.5, size / 260);

    useEffect(() => {
        if (!pathRefs.current.length) return;

        const paths = pathRefs.current;

        const lengths = paths.map((path) => {
            const length = path.getTotalLength();
            path.style.strokeDasharray = `${length}`;
            path.style.strokeDashoffset = `${length}`;
            return length;
        });

        const drawDuration = loopDuration * 800;
        const holdDuration = 300;
        const eraseDuration = loopDuration * 800;
        const totalCycle = drawDuration + holdDuration + eraseDuration;

        const start = performance.now();

        const animate = (time: number) => {
            const phase = (time - start) % totalCycle;

            if (phase < drawDuration) {
                setFillVisible(false);
                paths.forEach((path, i) => {
                    const p = phase / drawDuration;
                    path.style.strokeDashoffset = `${lengths[i] * (1 - p)}`;
                });
            } else if (phase < drawDuration + holdDuration) {
                setFillVisible(true);
                paths.forEach((path) => {
                    path.style.strokeDashoffset = '0';
                });
            } else {
                setFillVisible(false);
                const p = (phase - drawDuration - holdDuration) / eraseDuration;
                paths.forEach((path, i) => {
                    path.style.strokeDashoffset = `${lengths[i] * p}`;
                });
            }

            rafRef.current = requestAnimationFrame(animate);
        };

        rafRef.current = requestAnimationFrame(animate);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return (
        <div className='mx-auto flex w-fit flex-col items-center rounded-xl p-4'>
            <svg width={size} height={size * 1.33} viewBox='90 70 130 160' fill='none'>
                <path d={PATH_1} fill={strokeColor} style={{ opacity: fillVisible ? 1 : 0 }} />
                <path d={PATH_2} fill={strokeColor} style={{ opacity: fillVisible ? 1 : 0 }} />

                <path
                    ref={(el) => {
                        if (el) pathRefs.current[0] = el;
                    }}
                    d={PATH_1}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    fill='none'
                />
                <path
                    ref={(el) => {
                        if (el) pathRefs.current[1] = el;
                    }}
                    d={PATH_2}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    fill='none'
                />
            </svg>

            {showLoadingText && (
                <p className='my-3 text-center font-semibold tracking-wide'>
                    {text ?? 'Please wait a moment…'}
                </p>
            )}
        </div>
    );
};

export default LoadingAnimation;
