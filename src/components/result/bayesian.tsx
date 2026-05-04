import Fetch from '@/lib/fetch';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

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
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>DISTRO NAME</TableHead>
                    <TableHead>TOTAL REVIEWS</TableHead>
                    <TableHead>SHRINKAGE COEFFICIENT</TableHead>
                    <TableHead>CONFIDENCE ADJUSTMENT</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {rows.map((row) => (
                    <TableRow key={row.distro}>
                        <TableCell className='font-medium'>{row.distro}</TableCell>
                        <TableCell>{row.total_reviews}</TableCell>
                        <TableCell>{row.shrinkage}</TableCell>
                        <TableCell className='font-semibold'>{row.score}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
