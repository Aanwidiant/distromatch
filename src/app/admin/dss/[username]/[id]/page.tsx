import Header from '@/components/layouts/admin/header';
import { SquareChartGantt } from 'lucide-react';
import DssMeta from './components/dss-meta';
import DistroData from '@/components/result/distro-data';
import NormalizeVector from '@/components/result/normalize-vector';
import WeightedData from '@/components/result/weighted';
import TopsisResult from '@/components/result/topsis';
import BayesianResult from '@/components/result/bayesian';
import PenaltyRank from '@/components/result/penalty-rank';
import SurveyResult from '@/components/result/survey-result';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type Props = {
    params: Promise<{
        id: string;
        username: string;
    }>;
};

export default async function DssAuditDetail({ params }: Props) {
    const { id, username } = await params;

    return (
        <main className='bg-bg-2'>
            <Header icon={<SquareChartGantt className='size-6' />} title='DSS Audit Detail' />
            <div className='h-[calc(100vh-4.5rem)] overflow-y-auto'>
                <div className='space-y-6 p-6'>
                    <DssMeta id={id} username={username} />
                    <Tabs defaultValue='survey' className='space-y-3'>
                        <div className='overflow-x-auto overflow-y-hidden'>
                            <TabsList variant='line' className='flex h-fit w-max min-w-full gap-2'>
                                <TabsTrigger value='survey'>Survey Result</TabsTrigger>
                                <TabsTrigger value='distro'>Distro Data</TabsTrigger>
                                <TabsTrigger value='normalize'>Vector Normalization</TabsTrigger>
                                <TabsTrigger value='norm-weight'>Weighted Normalized</TabsTrigger>
                                <TabsTrigger value='topsis'>TOPSIS Calculation</TabsTrigger>
                                <TabsTrigger value='bayesian'>Bayesian Calculation</TabsTrigger>
                                <TabsTrigger value='penalty'>Penalty & Rank</TabsTrigger>
                            </TabsList>
                        </div>
                        <TabsContent value='survey'>
                            <SurveyResult runId={id} />
                        </TabsContent>
                        <TabsContent value='distro'>
                            <DistroData runId={id} />
                        </TabsContent>
                        <TabsContent value='normalize'>
                            <NormalizeVector runId={id} />
                        </TabsContent>
                        <TabsContent value='norm-weight'>
                            <WeightedData runId={id} />
                        </TabsContent>
                        <TabsContent value='topsis'>
                            <TopsisResult runId={id} />
                        </TabsContent>
                        <TabsContent value='bayesian'>
                            <BayesianResult runId={id} />
                        </TabsContent>
                        <TabsContent value='penalty'>
                            <PenaltyRank runId={id} />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </main>
    );
}
