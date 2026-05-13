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

type NormalizeRow = {
    distro: string;
    ux: string;
    performance: string;
    stability: string;
    features: string;
    support: string;
};

type NormalizeResponse = {
    rows_map: NormalizeRow[];
};

type ApiResponse<T> = {
    success: boolean;
    data: T;
};

type Props = {
    runId: string;
};

async function getNormalize(runId: string): Promise<NormalizeRow[]> {
    try {
        const res = await Fetch.GET<ApiResponse<NormalizeResponse>>(`/dss/${runId}/normalize`);

        if (!res.success) return [];

        return res.data.rows_map;
    } catch (error) {
        console.error('Fetch normalize error:', error);
        return [];
    }
}

export default async function NormalizeVector({ runId }: Props) {
    const rows = await getNormalize(runId);
    const t = await getTranslations('result.normalizeVector');

    if (!rows.length) {
        return <div>{t('status.failed')}</div>;
    }

    return (
        <div className='grid gap-6 lg:grid-cols-3'>
            {/* TABLE SECTION */}
            <div className='overflow-x-auto lg:col-span-2'>
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
            </div>

            {/* FORMULA SECTION */}
            <div className='space-y-5'>
                <div className='bg-background border-stroke rounded-2xl border p-5'>
                    <h2 className='text-xl font-semibold'>{t('normalizationTitle')}</h2>

                    <p className='text-muted-foreground mt-1 text-sm'>
                        {t('normalizationDescription')}
                    </p>
                </div>

                <div className='bg-background border-stroke rounded-2xl border p-5'>
                    <div className='space-y-3'>
                        <h3 className='text-base font-semibold'>{t('formulaLabel')}</h3>

                        <div className='bg-bg-2 overflow-x-auto rounded-xl p-4'>
                            <BlockMath math={FORMULAS.topsisNormalized} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
