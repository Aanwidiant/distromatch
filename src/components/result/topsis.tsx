import Fetch from '@/lib/fetch';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

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

    if (!rows.length) {
        return <div>Failed to load data</div>;
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>DISTRO NAME</TableHead>
                    <TableHead>JARAK SOLUSI IDEAL POSITIF</TableHead>
                    <TableHead>JARAK SOLUSI IDEAL NEGATIF</TableHead>
                    <TableHead>NILAI PREFERENSI (CC)</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {rows.map((row) => (
                    <TableRow key={row.distro}>
                        <TableCell className='font-medium'>{row.distro}</TableCell>
                        <TableCell>{row.distance_ideal_positive}</TableCell>
                        <TableCell>{row.distance_ideal_negative}</TableCell>
                        <TableCell className='font-semibold'>{row.cc_score}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
