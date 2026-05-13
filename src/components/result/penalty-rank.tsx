import Fetch from '@/lib/fetch';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { InlineMath, BlockMath } from 'react-katex';
import { FORMULAS } from '@/lib/formulas';
import 'katex/dist/katex.min.css';
import { getTranslations } from 'next-intl/server';

type PenaltyRow = {
    distro: string;
    distance: string;
    distanceNorm: string;
    penalty: string;
    utility: string;
    rank: number;
};

type PenaltyResponse = {
    rows: PenaltyRow[];
};

type ApiResponse<T> = {
    success: boolean;
    data: T;
};

type Props = {
    runId: string;
};

async function getPenalty(runId: string): Promise<PenaltyRow[]> {
    try {
        const res = await Fetch.GET<ApiResponse<PenaltyResponse>>(`/dss/${runId}/penalty`);

        if (!res.success) return [];

        return res.data.rows;
    } catch (err) {
        console.error('penalty error:', err);
        return [];
    }
}

export default async function PenaltyRank({ runId }: Props) {
    const rows = await getPenalty(runId);
    const t = await getTranslations('result.penaltyRank');

    if (!rows.length) {
        return <div>{t('status.failed')}</div>;
    }

    return (
        <div className='grid gap-6 lg:grid-cols-3'>
            {/* TABLE SECTION */}
            <div className='overflow-x-auto lg:col-span-2'>
                <div className='bg-background border-stroke rounded-2xl border'>
                    <div className='border-stroke border-b p-5'>
                        <h2 className='text-xl font-semibold'>{t('title')}</h2>

                        <p className='text-muted-foreground mt-1 text-sm'>{t('description')}</p>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow className='bg-bg-2 hover:bg-bg-2'>
                                <TableHead className='min-w-45 font-semibold'>
                                    {t('table.columnDistribution')}
                                </TableHead>

                                <TableHead className='text-center font-semibold'>
                                    {t('table.columnDistance')}
                                </TableHead>

                                <TableHead className='text-center font-semibold'>
                                    {t('table.columnDistanceNorm')}
                                </TableHead>

                                <TableHead className='text-center font-semibold'>
                                    {t('table.columnPenalty')}
                                </TableHead>

                                <TableHead className='text-right font-semibold'>
                                    {t('table.columnUtility')}
                                </TableHead>

                                <TableHead className='text-center font-semibold'>
                                    {t('table.columnRank')}
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {rows.map((row) => (
                                <TableRow key={row.distro}>
                                    <TableCell className='font-medium'>{row.distro}</TableCell>

                                    <TableCell className='text-center'>{row.distance}</TableCell>

                                    <TableCell className='text-center'>
                                        {row.distanceNorm}
                                    </TableCell>

                                    <TableCell className='text-center'>
                                        <span className='bg-red/10 text-red inline-flex rounded-md px-2 py-1 text-sm font-medium'>
                                            {row.penalty}
                                        </span>
                                    </TableCell>

                                    <TableCell className='text-right'>
                                        <span className='bg-primary inline-flex rounded-lg px-3 py-1 text-sm font-semibold text-white'>
                                            {row.utility}
                                        </span>
                                    </TableCell>

                                    <TableCell className='text-center'>
                                        <span className='bg-primary/10 text-primary inline-flex size-8 items-center justify-center rounded-full text-sm font-bold'>
                                            #{row.rank}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* FORMULA SECTION */}
            <div className='space-y-5 overflow-x-auto'>
                <div className='bg-background border-stroke rounded-2xl border p-5'>
                    <h2 className='text-xl font-semibold'>{t('calculationTitle')}</h2>

                    <p className='text-muted-foreground mt-1 text-sm'>
                        {t('calculationDescription')}
                    </p>
                </div>

                <div className='bg-background border-stroke space-y-6 rounded-2xl border p-5'>
                    <div className='space-y-3'>
                        <h3 className='text-base font-semibold'>{t('formula.userPreference')}</h3>

                        <div className='bg-bg-2 overflow-x-auto rounded-xl p-4'>
                            <BlockMath math={FORMULAS.prefRaw} />
                        </div>
                    </div>

                    <div className='space-y-3'>
                        <h3 className='text-base font-semibold'>
                            {t('formula.symmetricDistance')}
                        </h3>

                        <div className='bg-bg-2 overflow-x-auto rounded-xl p-4'>
                            <BlockMath math={FORMULAS.symmetricDistance} />
                        </div>
                    </div>

                    <div className='space-y-3'>
                        <h3 className='text-base font-semibold'>
                            {t('formula.distanceNormalization')}
                        </h3>

                        <div className='bg-bg-2 overflow-x-auto rounded-xl p-4'>
                            <BlockMath math={FORMULAS.distanceNorm} />
                        </div>
                    </div>

                    <div className='space-y-3'>
                        <h3 className='text-base font-semibold'>{t('formula.powerPenalty')}</h3>

                        <div className='bg-bg-2 overflow-x-auto rounded-xl p-4'>
                            <BlockMath math={FORMULAS.penalty} />
                        </div>
                    </div>

                    <div className='space-y-3'>
                        <h3 className='text-base font-semibold'>{t('formula.utilityFunction')}</h3>

                        <div className='bg-bg-2 overflow-x-auto rounded-xl p-4'>
                            <BlockMath math={FORMULAS.utility} />
                        </div>
                    </div>

                    <div className='border-stroke border-t pt-4'>
                        <h3 className='mb-3 text-lg font-semibold'>{t('ranking.title')}</h3>

                        <div className='space-y-5'>
                            <div className='space-y-2'>
                                <p className='text-sm font-medium'>{t('ranking.orderingRule')}</p>

                                <div className='bg-bg-2 overflow-x-auto rounded-xl p-4'>
                                    <BlockMath math={FORMULAS.orderingRule} />
                                </div>
                            </div>

                            <div className='space-y-2'>
                                <p className='text-sm font-medium'>
                                    {t('ranking.denseRank')} <InlineMath math='\varepsilon' />
                                </p>

                                <div className='bg-bg-2 overflow-x-auto rounded-xl p-4'>
                                    <BlockMath math={FORMULAS.denseRank} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
