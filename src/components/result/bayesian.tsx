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

    if (!rows.length) {
        return <div>Failed to load data</div>;
    }

    return (
        <div className='grid gap-6 lg:grid-cols-3'>
            {/* TABLE SECTION */}
            <div className='lg:col-span-2'>
                <div className='bg-background border-stroke overflow-x-auto rounded-2xl border'>
                    <div className='border-stroke border-b p-5'>
                        <h2 className='text-xl font-semibold'>Bayesian Adjustment Result</h2>

                        <p className='text-muted-foreground mt-1 text-sm'>
                            Bayesian confidence adjustment applied to TOPSIS preference scores using
                            review reliability.
                        </p>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow className='bg-bg-2 hover:bg-bg-2'>
                                <TableHead className='min-w-45 font-semibold'>
                                    Distribution
                                </TableHead>

                                <TableHead className='text-center font-semibold'>
                                    Total Reviews
                                </TableHead>

                                <TableHead className='text-center font-semibold'>
                                    Shrinkage Coefficient
                                </TableHead>

                                <TableHead className='text-right font-semibold'>
                                    Confidence Score
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
            <div className='space-y-5'>
                <div className='bg-background border-stroke rounded-2xl border p-5'>
                    <h2 className='text-xl font-semibold'>Bayesian Formula</h2>

                    <p className='text-muted-foreground mt-1 text-sm'>
                        Mathematical formulas used for Bayesian shrinkage and confidence-adjusted
                        scoring.
                    </p>
                </div>

                <div className='bg-background border-stroke space-y-6 rounded-2xl border p-5'>
                    <div className='space-y-3'>
                        <h3 className='text-base font-semibold'>Mean of Observed Scores</h3>

                        <div className='bg-bg-2 overflow-x-auto rounded-xl p-4'>
                            <BlockMath math={FORMULAS.bayesMeanCc} />
                        </div>
                    </div>

                    <div className='space-y-3'>
                        <h3 className='text-base font-semibold'>Shrinkage Coefficient</h3>

                        <div className='bg-bg-2 overflow-x-auto rounded-xl p-4'>
                            <BlockMath math={FORMULAS.bayesShrinkage} />
                        </div>
                    </div>

                    <div className='space-y-3'>
                        <h3 className='text-base font-semibold'>Confidence Adjusted Score</h3>

                        <div className='bg-bg-2 overflow-x-auto rounded-xl p-4'>
                            <BlockMath math={FORMULAS.bayesConfidenceAdjusted} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
