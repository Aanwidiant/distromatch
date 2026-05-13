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

type WeightedRow = {
    distro: string;
    ux: string;
    performance: string;
    stability: string;
    features: string;
    support: string;
};

type WeightedResponse = {
    rows_map: WeightedRow[];
};

type IdealValue = {
    ux: string;
    performance: string;
    stability: string;
    features: string;
    support: string;
};

type IdealResponse = {
    positive: IdealValue;
    negative: IdealValue;
};

type ApiResponse<T> = {
    success: boolean;
    data: T;
};

type Props = {
    runId: string;
};

async function getWeighted(runId: string): Promise<WeightedRow[]> {
    try {
        const res = await Fetch.GET<ApiResponse<WeightedResponse>>(`/dss/${runId}/weighted`);

        if (!res.success) return [];
        return res.data.rows_map;
    } catch (err) {
        console.error('weighted error:', err);
        return [];
    }
}

async function getIdeal(runId: string): Promise<IdealResponse | null> {
    try {
        const res = await Fetch.GET<ApiResponse<IdealResponse>>(`/dss/${runId}/ideal`);

        if (!res.success) return null;
        return res.data;
    } catch (err) {
        console.error('ideal error:', err);
        return null;
    }
}

export default async function WeightedData({ runId }: Props) {
    const [rows, ideal] = await Promise.all([getWeighted(runId), getIdeal(runId)]);
    const t = await getTranslations('result.weightedData');

    if (!rows.length || !ideal) {
        return <div>{t('status.failed')}</div>;
    }

    return (
        <div className='grid gap-6 lg:grid-cols-3'>
            {/* TABLE SECTION */}
            <div className='space-y-6 overflow-x-auto lg:col-span-2'>
                {/* WEIGHTED MATRIX */}
                <div className='bg-background border-stroke rounded-2xl border'>
                    <div className='border-stroke border-b p-5'>
                        <h2 className='text-xl font-semibold'>{t('matrixTitle')}</h2>

                        <p className='text-muted-foreground mt-1 text-sm'>
                            {t('matrixDescription')}
                        </p>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow className='bg-bg-2 hover:bg-bg-2'>
                                <TableHead className='min-w-45 font-semibold'>
                                    {t('table.columnDistribution')}
                                </TableHead>

                                <TableHead className='text-center font-semibold'>
                                    {t('table.columnUx')}
                                </TableHead>

                                <TableHead className='text-center font-semibold'>
                                    {t('table.columnPerformance')}
                                </TableHead>

                                <TableHead className='text-center font-semibold'>
                                    {t('table.columnStability')}
                                </TableHead>

                                <TableHead className='text-center font-semibold'>
                                    {t('table.columnFeatures')}
                                </TableHead>

                                <TableHead className='text-center font-semibold'>
                                    {t('table.columnSupport')}
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {rows.map((row) => (
                                <TableRow key={row.distro}>
                                    <TableCell className='font-medium'>{row.distro}</TableCell>

                                    <TableCell className='text-center'>{row.ux}</TableCell>

                                    <TableCell className='text-center'>{row.performance}</TableCell>

                                    <TableCell className='text-center'>{row.stability}</TableCell>

                                    <TableCell className='text-center'>{row.features}</TableCell>

                                    <TableCell className='text-center'>{row.support}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* IDEAL SOLUTION */}
                <div className='bg-background border-stroke overflow-x-auto rounded-2xl border'>
                    <div className='border-stroke border-b p-5'>
                        <h2 className='text-xl font-semibold'>{t('idealTitle')}</h2>

                        <p className='text-muted-foreground mt-1 text-sm'>
                            {t('idealDescription')}
                        </p>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow className='bg-bg-2 hover:bg-bg-2'>
                                <TableHead className='min-w-55 font-semibold'>
                                    {t('table.columnType')}
                                </TableHead>

                                <TableHead className='text-center font-semibold'>
                                    {t('table.columnUx')}
                                </TableHead>

                                <TableHead className='text-center font-semibold'>
                                    {t('table.columnPerformance')}
                                </TableHead>

                                <TableHead className='text-center font-semibold'>
                                    {t('table.columnStability')}
                                </TableHead>

                                <TableHead className='text-center font-semibold'>
                                    {t('table.columnFeatures')}
                                </TableHead>

                                <TableHead className='text-center font-semibold'>
                                    {t('table.columnSupport')}
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            <TableRow>
                                <TableCell className='text-green font-medium'>
                                    {t('table.rowPositiveIdeal')}
                                </TableCell>

                                <TableCell className='text-center'>{ideal.positive.ux}</TableCell>

                                <TableCell className='text-center'>
                                    {ideal.positive.performance}
                                </TableCell>

                                <TableCell className='text-center'>
                                    {ideal.positive.stability}
                                </TableCell>

                                <TableCell className='text-center'>
                                    {ideal.positive.features}
                                </TableCell>

                                <TableCell className='text-center'>
                                    {ideal.positive.support}
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell className='text-red font-medium'>
                                    {t('table.rowNegativeIdeal')}
                                </TableCell>

                                <TableCell className='text-center'>{ideal.negative.ux}</TableCell>

                                <TableCell className='text-center'>
                                    {ideal.negative.performance}
                                </TableCell>

                                <TableCell className='text-center'>
                                    {ideal.negative.stability}
                                </TableCell>

                                <TableCell className='text-center'>
                                    {ideal.negative.features}
                                </TableCell>

                                <TableCell className='text-center'>
                                    {ideal.negative.support}
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell className='font-medium'>
                                    {t('table.rowCriteriaType')}
                                </TableCell>

                                <TableCell className='text-center'>{t('table.benefit')}</TableCell>

                                <TableCell className='text-center'>{t('table.benefit')}</TableCell>

                                <TableCell className='text-center'>{t('table.benefit')}</TableCell>

                                <TableCell className='text-center'>{t('table.benefit')}</TableCell>

                                <TableCell className='text-center'>{t('table.benefit')}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* FORMULA SECTION */}
            <div className='space-y-5'>
                <div className='bg-background border-stroke rounded-2xl border p-5'>
                    <h2 className='text-xl font-semibold'>{t('formulaTitle')}</h2>

                    <p className='text-muted-foreground mt-1 text-sm'>{t('formulaDescription')}</p>
                </div>

                <div className='bg-background border-stroke space-y-6 rounded-2xl border p-5'>
                    <div className='space-y-3'>
                        <h3 className='text-base font-semibold'>{t('weightedMatrixFormula')}</h3>

                        <div className='bg-bg-2 overflow-x-auto rounded-xl p-4'>
                            <BlockMath math={FORMULAS.topsisWeighted} />
                        </div>
                    </div>

                    <div className='space-y-3'>
                        <h3 className='text-base font-semibold'>{t('idealSolutionFormula')}</h3>

                        <div className='bg-bg-2 overflow-x-auto rounded-xl p-4'>
                            <BlockMath math={FORMULAS.topsisIdeals} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
