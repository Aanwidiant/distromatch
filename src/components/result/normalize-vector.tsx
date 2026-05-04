import Fetch from '@/lib/fetch';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

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
    );
}
