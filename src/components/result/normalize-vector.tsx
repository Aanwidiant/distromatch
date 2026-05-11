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

    if (!rows.length) {
        return <div>Failed to load data</div>;
    }

    return (
        <div className='grid gap-6 lg:grid-cols-3'>
            {/* TABLE SECTION */}
            <div className='lg:col-span-2'>
                <div className='bg-background border-stroke overflow-x-auto rounded-2xl border'>
                    <div className='border-stroke border-b p-5'>
                        <h2 className='text-xl font-semibold'>Normalized Decision Matrix</h2>

                        <p className='text-muted-foreground mt-1 text-sm'>
                            TOPSIS normalized matrix generated from the original decision matrix
                            values.
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
            </div>

            {/* FORMULA SECTION */}
            <div className='space-y-5'>
                <div className='bg-background border-stroke rounded-2xl border p-5'>
                    <h2 className='text-xl font-semibold'>Matrix Normalization</h2>

                    <p className='text-muted-foreground mt-1 text-sm'>
                        Formula used to normalize the decision matrix in the TOPSIS method.
                    </p>
                </div>

                <div className='bg-background border-stroke rounded-2xl border p-5'>
                    <div className='space-y-3'>
                        <h3 className='text-base font-semibold'>Normalization Formula</h3>

                        <div className='bg-bg-2 overflow-x-auto rounded-xl p-4'>
                            <BlockMath math={FORMULAS.topsisNormalized} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
