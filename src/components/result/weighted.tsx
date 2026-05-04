import Fetch from '@/lib/fetch';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

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
        <div className='space-y-6'>
            {/* TABLE WEIGHTED */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>DISTRO NAME</TableHead>
                        <TableHead>USER EXPERIENCE</TableHead>
                        <TableHead>PERFORMANCE</TableHead>
                        <TableHead>STABILITY</TableHead>
                        <TableHead>FEATURES</TableHead>
                        <TableHead>SUPPORT</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.distro}>
                            <TableCell className='font-medium'>{row.distro}</TableCell>
                            <TableCell>{row.ux}</TableCell>
                            <TableCell>{row.performance}</TableCell>
                            <TableCell>{row.stability}</TableCell>
                            <TableCell>{row.features}</TableCell>
                            <TableCell>{row.support}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* TABLE IDEAL */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead></TableHead>
                        <TableHead>USER EXPERIENCE</TableHead>
                        <TableHead>PERFORMANCE</TableHead>
                        <TableHead>STABILITY</TableHead>
                        <TableHead>FEATURES</TableHead>
                        <TableHead>SUPPORT</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell className='font-medium'>SOLUSI IDEAL POSITIF</TableCell>
                        <TableCell>{ideal.positive.ux}</TableCell>
                        <TableCell>{ideal.positive.performance}</TableCell>
                        <TableCell>{ideal.positive.stability}</TableCell>
                        <TableCell>{ideal.positive.features}</TableCell>
                        <TableCell>{ideal.positive.support}</TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell className='font-medium'>SOLUSI IDEAL NEGATIF</TableCell>
                        <TableCell>{ideal.negative.ux}</TableCell>
                        <TableCell>{ideal.negative.performance}</TableCell>
                        <TableCell>{ideal.negative.stability}</TableCell>
                        <TableCell>{ideal.negative.features}</TableCell>
                        <TableCell>{ideal.negative.support}</TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell className='font-medium'>KETERANGAN</TableCell>
                        <TableCell>BENEFIT</TableCell>
                        <TableCell>BENEFIT</TableCell>
                        <TableCell>BENEFIT</TableCell>
                        <TableCell>BENEFIT</TableCell>
                        <TableCell>BENEFIT</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
}
