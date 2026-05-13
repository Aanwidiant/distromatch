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

type TopsisRow = {
    distro: string;
    distance_ideal_positive: string;
    distance_ideal_negative: string;
    cc_score: string;
};

type TopsisResponse = {
    rows_map: TopsisRow[];
};

type ApiResponse<T> = {
    success: boolean;
    data: T;
};

type Props = {
    runId: string;
};

async function getTopsis(runId: string): Promise<TopsisRow[]> {
    try {
        const res = await Fetch.GET<ApiResponse<TopsisResponse>>(`/dss/${runId}/topsis`);

        if (!res.success) return [];

        return res.data.rows_map;
    } catch (err) {
        console.error('topsis error:', err);
        return [];
    }
}

export default async function TopsisResult({ runId }: Props) {
    const rows = await getTopsis(runId);
    const t = await getTranslations('result.topsisResult');

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
                                    {t('table.columnPositiveDistance')}
                                </TableHead>

                                <TableHead className='text-center font-semibold'>
                                    {t('table.columnNegativeDistance')}
                                </TableHead>

                                <TableHead className='text-right font-semibold'>
                                    {t('table.columnPreferenceScore')}
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
                                        {row.distance_ideal_positive}
                                    </TableCell>

                                    <TableCell className='text-center'>
                                        {row.distance_ideal_negative}
                                    </TableCell>

                                    <TableCell className='text-right'>
                                        <span className='bg-primary inline-flex rounded-lg px-3 py-1 text-sm font-semibold text-white'>
                                            {row.cc_score}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* FORMULA SECTION */}
            <div className='space-y-5'>
                <div className='bg-background border-stroke rounded-2xl border p-5'>
                    <h2 className='text-xl font-semibold'>{t('calculationTitle')}</h2>

                    <p className='text-muted-foreground mt-1 text-sm'>
                        {t('calculationDescription')}
                    </p>
                </div>

                <div className='bg-background border-stroke space-y-6 rounded-2xl border p-5'>
                    <div className='space-y-3'>
                        <h3 className='text-base font-semibold'>{t('idealDistanceFormula')}</h3>

                        <div className='bg-bg-2 overflow-x-auto rounded-xl p-4'>
                            <BlockMath math={FORMULAS.topsisDistances} />
                        </div>
                    </div>

                    <div className='space-y-3'>
                        <h3 className='text-base font-semibold'>
                            {t('closenessCoefficientFormula')}
                        </h3>

                        <div className='bg-bg-2 overflow-x-auto rounded-xl p-4'>
                            <BlockMath math={FORMULAS.topsisCcScore} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
