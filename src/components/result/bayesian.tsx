import Fetch from '@/lib/fetch';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { BlockMath } from 'react-katex';
import { FORMULAS } from '@/lib/formulas';
import 'katex/dist/katex.min.css';
import { getTranslations } from 'next-intl/server';

type BayesianRow = {
    distro: string;
    total_reviews: number;
    shrinkage: string;
    score: string;
};

type BayesianResponse = {
    rows_map: BayesianRow[];
};

type ApiResponse<T> = {
    success: boolean;
    data: T;
};

type Props = {
    runId: string;
};

async function getBayesian(runId: string): Promise<BayesianRow[]> {
    try {
        const res = await Fetch.GET<ApiResponse<BayesianResponse>>(`/dss/${runId}/bayesian`);

        if (!res.success) return [];

        return res.data.rows_map;
    } catch (err) {
        console.error('bayesian error:', err);
        return [];
    }
}

export default async function BayesianResult({ runId }: Props) {
    const rows = await getBayesian(runId);
    const t = await getTranslations('result.bayesianResult');

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
                                    {t('table.columnTotalReviews')}
                                </TableHead>

                                <TableHead className='text-center font-semibold'>
                                    {t('table.columnShrinkage')}
                                </TableHead>

                                <TableHead className='text-right font-semibold'>
                                    {t('table.columnConfidenceScore')}
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {rows.map((row) => (
                                <TableRow key={row.distro}>
                                    <TableCell className='font-medium'>
                                        <div className='flex items-center gap-3'>{row.distro}</div>
                                    </TableCell>

                                    <TableCell className='text-center'>
                                        <span className='bg-accent-1 inline-flex rounded-md px-2 py-1 text-sm font-medium'>
                                            {row.total_reviews}
                                        </span>
                                    </TableCell>

                                    <TableCell className='text-center'>{row.shrinkage}</TableCell>

                                    <TableCell className='text-right'>
                                        <span className='bg-primary inline-flex rounded-lg px-3 py-1 text-sm font-semibold text-white'>
                                            {row.score}
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
                    <h2 className='text-xl font-semibold'>{t('formulaTitle')}</h2>

                    <p className='text-muted-foreground mt-1 text-sm'>{t('formulaDescription')}</p>
                </div>

                <div className='bg-background border-stroke space-y-6 rounded-2xl border p-5'>
                    <div className='space-y-3'>
                        <h3 className='text-base font-semibold'>{t('meanObservedFormula')}</h3>

                        <div className='bg-bg-2 overflow-x-auto rounded-xl p-4'>
                            <BlockMath math={FORMULAS.bayesMeanCc} />
                        </div>
                    </div>

                    <div className='space-y-3'>
                        <h3 className='text-base font-semibold'>
                            {t('shrinkageCoefficientFormula')}
                        </h3>

                        <div className='bg-bg-2 overflow-x-auto rounded-xl p-4'>
                            <BlockMath math={FORMULAS.bayesShrinkage} />
                        </div>
                    </div>

                    <div className='space-y-3'>
                        <h3 className='text-base font-semibold'>
                            {t('confidenceAdjustedFormula')}
                        </h3>

                        <div className='bg-bg-2 overflow-x-auto rounded-xl p-4'>
                            <BlockMath math={FORMULAS.bayesConfidenceAdjusted} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
