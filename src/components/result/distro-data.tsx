import Fetch from '@/lib/fetch';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

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
        <div className='space-y-6'>
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
                    {distro.map((row, i) => (
                        <TableRow key={i}>
                            <TableCell>{row.distro}</TableCell>
                            <TableCell>{row.ux}</TableCell>
                            <TableCell>{row.performance}</TableCell>
                            <TableCell>{row.stability}</TableCell>
                            <TableCell>{row.features}</TableCell>
                            <TableCell>{row.support}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell>Denominator</TableCell>
                        <TableCell>{denominator.ux}</TableCell>
                        <TableCell>{denominator.performance}</TableCell>
                        <TableCell>{denominator.stability}</TableCell>
                        <TableCell>{denominator.features}</TableCell>
                        <TableCell>{denominator.support}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
}
