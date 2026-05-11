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

    if (!rows.length || !ideal) {
        return <div>Failed to load data</div>;
    }

    return (
        <div className='grid gap-6 lg:grid-cols-3'>
            {/* TABLE SECTION */}
            <div className='space-y-6 lg:col-span-2'>
                {/* WEIGHTED MATRIX */}
                <div className='bg-background border-stroke overflow-x-auto rounded-2xl border'>
                    <div className='border-stroke border-b p-5'>
                        <h2 className='text-xl font-semibold'>Weighted Normalized Matrix</h2>

                        <p className='text-muted-foreground mt-1 text-sm'>
                            Weighted normalized decision matrix after applying TOPSIS criterion
                            weights.
                        </p>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow className='bg-bg-2 hover:bg-bg-2'>
                                <TableHead className='min-w-45 font-semibold'>
                                    Distribution
                                </TableHead>

                                <TableHead className='text-center font-semibold'>UX</TableHead>

                                <TableHead className='text-center font-semibold'>
                                    Performance
                                </TableHead>

                                <TableHead className='text-center font-semibold'>
                                    Stability
                                </TableHead>

                                <TableHead className='text-center font-semibold'>
                                    Features
                                </TableHead>

                                <TableHead className='text-center font-semibold'>Support</TableHead>
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
                        <h2 className='text-xl font-semibold'>Ideal Solutions</h2>

                        <p className='text-muted-foreground mt-1 text-sm'>
                            Positive and negative ideal solutions used in TOPSIS ranking
                            calculations.
                        </p>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow className='bg-bg-2 hover:bg-bg-2'>
                                <TableHead className='min-w-55 font-semibold'>Type</TableHead>

                                <TableHead className='text-center font-semibold'>UX</TableHead>

                                <TableHead className='text-center font-semibold'>
                                    Performance
                                </TableHead>

                                <TableHead className='text-center font-semibold'>
                                    Stability
                                </TableHead>

                                <TableHead className='text-center font-semibold'>
                                    Features
                                </TableHead>

                                <TableHead className='text-center font-semibold'>Support</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            <TableRow>
                                <TableCell className='text-green font-medium'>
                                    Positive Ideal
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
                                    Negative Ideal
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
                                <TableCell className='font-medium'>Criteria Type</TableCell>

                                <TableCell className='text-center'>BENEFIT</TableCell>

                                <TableCell className='text-center'>BENEFIT</TableCell>

                                <TableCell className='text-center'>BENEFIT</TableCell>

                                <TableCell className='text-center'>BENEFIT</TableCell>

                                <TableCell className='text-center'>BENEFIT</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* FORMULA SECTION */}
            <div className='space-y-5'>
                <div className='bg-background border-stroke rounded-2xl border p-5'>
                    <h2 className='text-xl font-semibold'>TOPSIS Weighting</h2>

                    <p className='text-muted-foreground mt-1 text-sm'>
                        Mathematical formulas used for weighted normalization and ideal solution
                        calculation.
                    </p>
                </div>

                <div className='bg-background border-stroke space-y-6 rounded-2xl border p-5'>
                    <div className='space-y-3'>
                        <h3 className='text-base font-semibold'>Weighted Matrix Formula</h3>

                        <div className='bg-bg-2 overflow-x-auto rounded-xl p-4'>
                            <BlockMath math={FORMULAS.topsisWeighted} />
                        </div>
                    </div>

                    <div className='space-y-3'>
                        <h3 className='text-base font-semibold'>Ideal Solution Formula</h3>

                        <div className='bg-bg-2 overflow-x-auto rounded-xl p-4'>
                            <BlockMath math={FORMULAS.topsisIdeals} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
