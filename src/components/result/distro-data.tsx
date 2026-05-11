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

type DistroRow = {
    distro: string;
    ux: string;
    performance: string;
    stability: string;
    features: string;
    support: string;
};

type DistroResponse = {
    rows: DistroRow[];
};

type Denominator = {
    ux: string;
    performance: string;
    stability: string;
    features: string;
    support: string;
};

type ApiResponse<T> = {
    success: boolean;
    data: T;
};

type Props = {
    runId: string;
};

async function getData(runId: string): Promise<{
    distro: DistroRow[];
    denominator: Denominator | null;
}> {
    try {
        const [distroRes, denomRes] = await Promise.all([
            Fetch.GET<ApiResponse<DistroResponse>>(`/dss/distro`),
            Fetch.GET<ApiResponse<Denominator>>(`/dss/${runId}/denominator`),
        ]);

        return {
            distro: distroRes.success ? distroRes.data.rows : [],
            denominator: denomRes.success ? denomRes.data : null,
        };
    } catch (error) {
        console.error(error);
        return { distro: [], denominator: null };
    }
}

export default async function DistroData({ runId }: Props) {
    const { distro, denominator } = await getData(runId);

    if (!distro.length || !denominator) {
        return <div>Failed to load data</div>;
    }

    return (
        <div className='grid gap-6 lg:grid-cols-3'>
            {/* TABLE SECTION */}
            <div className='space-y-6 lg:col-span-2'>
                {/* DISTRO TABLE */}
                <div className='bg-background border-stroke overflow-x-auto rounded-2xl border'>
                    <div className='border-stroke border-b p-5'>
                        <h2 className='text-xl font-semibold'>Linux Distribution Dataset</h2>

                        <p className='text-muted-foreground mt-1 text-sm'>
                            Raw criteria values used in the TOPSIS calculation.
                        </p>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow className='bg-bg-2 hover:bg-bg-2'>
                                <TableHead className='min-w-36 font-semibold'>
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
                            {distro.map((row, i) => (
                                <TableRow key={i}>
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

                {/* DENOMINATOR TABLE */}
                <div className='bg-background border-stroke overflow-x-auto rounded-2xl border'>
                    <div className='border-stroke border-b p-5'>
                        <h2 className='text-xl font-semibold'>TOPSIS Denominator</h2>

                        <p className='text-muted-foreground mt-1 text-sm'>
                            Vector normalization denominator for each criterion.
                        </p>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow className='bg-bg-2 hover:bg-bg-2'>
                                <TableHead className='font-semibold'>Criteria</TableHead>

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
                                <TableCell className='font-medium'>Denominator</TableCell>

                                <TableCell className='text-center'>{denominator.ux}</TableCell>

                                <TableCell className='text-center'>
                                    {denominator.performance}
                                </TableCell>

                                <TableCell className='text-center'>
                                    {denominator.stability}
                                </TableCell>

                                <TableCell className='text-center'>
                                    {denominator.features}
                                </TableCell>

                                <TableCell className='text-center'>{denominator.support}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* FORMULA SECTION */}
            <div className='space-y-5'>
                <div className='bg-background border-stroke rounded-2xl border p-5'>
                    <h2 className='text-xl font-semibold'>Vector Normalization</h2>

                    <p className='text-muted-foreground mt-1 text-sm'>
                        Formula used to calculate the denominator in the TOPSIS normalization
                        process.
                    </p>
                </div>

                <div className='bg-background border-stroke rounded-2xl border p-5'>
                    <div className='space-y-3'>
                        <h3 className='text-base font-semibold'>Denominator Formula</h3>

                        <div className='bg-bg-2 overflow-x-auto rounded-xl p-4'>
                            <BlockMath math={FORMULAS.topsisDenominator} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
