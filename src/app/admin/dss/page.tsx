import Header from '@/components/layouts/admin/header';
import { SquareChartGantt } from 'lucide-react';

export default function DssAuditPage() {
    return (
        <main>
            <Header icon={<SquareChartGantt className='size-6' />} title='DSS Audit' />
            <div></div>
        </main>
    );
}
