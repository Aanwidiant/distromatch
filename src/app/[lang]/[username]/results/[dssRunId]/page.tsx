'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Link } from '@/lib/i18n/navigation';

type DistroResult = {
    distro_id: number;
    score: number;
    rank: number;
    name: string;
};

type ResultData = {
    dssRunId: string;
    top: DistroResult[];
};

// Distro color accents & icons (kamu bisa extend ini)
const DISTRO_META: Record<string, { color: string; icon: string; tagline: string }> = {
    'Linux Mint': { color: '#87C059', icon: '◉', tagline: 'Familiar & polished' },
    'Pop!_OS': { color: '#48B9C7', icon: '◎', tagline: 'Modern & powerful' },
    Debian: { color: '#D70A53', icon: '◈', tagline: 'Rock-solid stable' },
    'Zorin OS': { color: '#15A6F0', icon: '✦', tagline: 'Beautiful for newcomers' },
    Manjaro: { color: '#35BF5C', icon: '◐', tagline: 'Rolling & flexible' },
    Ubuntu: { color: '#E95420', icon: '◉', tagline: 'The classic choice' },
    Fedora: { color: '#51A2DA', icon: '◎', tagline: 'Cutting-edge & clean' },
};

export default function ResultsPage() {
    const params = useParams();
    const { username, dssRunId } = params as { username: string; dssRunId: string };

    const [result, setResult] = useState<ResultData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const res = await fetch(`/dss/${dssRunId}`);
                const data = await res.json();
                if (!res.ok) throw new Error(data.message);
                setResult(data.result);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'Gagal memuat hasil');
            } finally {
                setLoading(false);
            }
        };
        fetchResult();
    }, [dssRunId]);

    if (loading) {
        return (
            <main className='flex min-h-screen items-center justify-center bg-[#080808] text-white'>
                <div className='text-center'>
                    <div className='mb-4 animate-pulse text-4xl'>◎</div>
                    <p className='font-mono text-sm text-white/40'>Memuat hasil analisis...</p>
                </div>
            </main>
        );
    }

    if (error || !result) {
        return (
            <main className='flex min-h-screen items-center justify-center bg-[#080808] text-white'>
                <div className='text-center'>
                    <p className='text-red-400'>{error || 'Hasil tidak ditemukan'}</p>
                    <Link
                        href='/quiz'
                        className='mt-4 block text-sm text-white/50 hover:text-white'
                    >
                        ← Ulangi quiz
                    </Link>
                </div>
            </main>
        );
    }

    const top1 = result.top[0];
    const rest = result.top.slice(1);
    const meta1 = DISTRO_META[top1.name] ?? { color: '#ffffff', icon: '◎', tagline: 'Your match' };

    return (
        <main className='min-h-screen bg-[#080808] px-6 py-12 text-white md:py-20'>
            <div className='mx-auto max-w-2xl'>
                {/* Header */}
                <div className='mb-16'>
                    <div className='mb-6 font-mono text-xs tracking-widest text-white/25 uppercase'>
                        @{username} · Hasil Analisis
                    </div>
                    <p className='mb-3 text-lg text-white/40'>Rekomendasi terbaik untukmu adalah</p>
                    <h1
                        className='mb-4 text-5xl leading-none font-bold md:text-6xl'
                        style={{ color: meta1.color }}
                    >
                        {top1.name}
                    </h1>
                    <p className='text-white/40'>{meta1.tagline}</p>
                </div>

                {/* Top pick card */}
                <div
                    className='relative mb-6 overflow-hidden rounded-2xl border p-8'
                    style={{
                        borderColor: meta1.color + '30',
                        backgroundColor: meta1.color + '08',
                    }}
                >
                    <div
                        className='absolute top-4 right-6 text-6xl opacity-10'
                        style={{ color: meta1.color }}
                    >
                        {meta1.icon}
                    </div>
                    <div className='flex items-start justify-between'>
                        <div>
                            <div className='mb-2 font-mono text-xs tracking-wider text-white/30 uppercase'>
                                #1 Match
                            </div>
                            <div className='mb-1 text-3xl font-bold'>{top1.name}</div>
                            <div className='text-sm text-white/40'>{meta1.tagline}</div>
                        </div>
                        <div className='text-right'>
                            <div
                                className='font-mono text-3xl font-bold'
                                style={{ color: meta1.color }}
                            >
                                {Math.round(top1.score * 100)}
                                <span className='text-lg'>%</span>
                            </div>
                            <div className='font-mono text-xs text-white/30'>match score</div>
                        </div>
                    </div>

                    {/* Score bar */}
                    <div className='mt-6 h-1.5 overflow-hidden rounded-full bg-white/8'>
                        <div
                            className='h-full rounded-full transition-all duration-1000'
                            style={{
                                width: `${Math.round(top1.score * 100)}%`,
                                backgroundColor: meta1.color,
                            }}
                        />
                    </div>
                </div>

                {/* Other results */}
                <div className='mb-12'>
                    <h2 className='mb-4 font-mono text-xs tracking-widest text-white/30 uppercase'>
                        Alternatif Lainnya
                    </h2>
                    <div className='space-y-3'>
                        {rest.map((distro) => {
                            const m = DISTRO_META[distro.name] ?? {
                                color: '#ffffff',
                                icon: '◎',
                                tagline: '',
                            };
                            const scorePercent = Math.round(distro.score * 100);
                            return (
                                <div
                                    key={distro.distro_id}
                                    className='flex items-center gap-4 rounded-xl border border-white/8 bg-white/3 px-5 py-4'
                                >
                                    <span className='w-4 font-mono text-xs text-white/20'>
                                        #{distro.rank}
                                    </span>
                                    <span className='text-lg' style={{ color: m.color }}>
                                        {m.icon}
                                    </span>
                                    <div className='flex-1'>
                                        <div className='text-sm font-medium'>{distro.name}</div>
                                        <div className='text-xs text-white/30'>{m.tagline}</div>
                                    </div>
                                    <div className='flex items-center gap-3'>
                                        {/* Mini bar */}
                                        <div className='h-1 w-20 overflow-hidden rounded-full bg-white/8'>
                                            <div
                                                className='h-full rounded-full'
                                                style={{
                                                    width: `${scorePercent}%`,
                                                    backgroundColor: m.color + '80',
                                                }}
                                            />
                                        </div>
                                        <span className='w-8 text-right font-mono text-xs text-white/40'>
                                            {scorePercent}%
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Actions */}
                <div className='flex flex-col gap-3 sm:flex-row'>
                    <Link
                        href='/quiz'
                        className='flex-1 rounded-xl border border-white/15 py-3 text-center font-mono text-sm text-white/50 transition-all hover:border-white/30 hover:text-white'
                    >
                        ← Ulangi Quiz
                    </Link>
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                        }}
                        className='flex-1 rounded-xl border border-white/8 bg-white/8 py-3 font-mono text-sm text-white/70 transition-all hover:bg-white/12 hover:text-white'
                    >
                        Salin Link Hasil ✦
                    </button>
                </div>

                {/* Meta */}
                <div className='mt-12 border-t border-white/5 pt-8 text-center'>
                    <p className='font-mono text-xs text-white/20'>Run ID: {result.dssRunId}</p>
                </div>
            </div>
        </main>
    );
}
