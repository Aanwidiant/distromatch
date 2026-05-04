import Fetch from '@/lib/fetch';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

type PenaltyRow = {
    distro: string;
    distance: string;
    distanceNorm: string;
    penalty: string;
    utility: string;
    rank: number;
};

type PenaltyResponse = {
    rows: PenaltyRow[];
};

type ApiResponse<T> = {
    success: boolean;
    data: T;
};

type Props = {
    runId: string;
};

async function getPenalty(runId: string): Promise<PenaltyRow[]> {
    try {
        const res = await Fetch.GET<ApiResponse<PenaltyResponse>>(`/dss/${runId}/penalty`);

        if (!res.success) return [];

        return res.data.rows;
    } catch (err) {
        console.error('penalty error:', err);
        return [];
    }
}

export default async function PenaltyRank({ runId }: Props) {
    const rows = await getPenalty(runId);

    if (!rows.length) {
        return <div>Failed to load data</div>;
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>DISTRO NAME</TableHead>
                    <TableHead>DISTANCE</TableHead>
                    <TableHead>DISTANCE NORM</TableHead>
                    <TableHead>PENALTY</TableHead>
                    <TableHead>UTILITY</TableHead>
                    <TableHead>RANK</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {rows.map((row) => (
                    <TableRow key={row.distro}>
                        <TableCell className='font-medium'>{row.distro}</TableCell>
                        <TableCell>{row.distance}</TableCell>
                        <TableCell>{row.distanceNorm}</TableCell>
                        <TableCell>{row.penalty}</TableCell>
                        <TableCell className='font-semibold'>{row.utility}</TableCell>
                        <TableCell className='text-center font-bold'>{row.rank}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
