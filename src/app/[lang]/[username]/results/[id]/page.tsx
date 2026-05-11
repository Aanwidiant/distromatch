import BayesianResult from '@/components/result/bayesian';
import DistroData from '@/components/result/distro-data';
import NormalizeVector from '@/components/result/normalize-vector';
import PenaltyRank from '@/components/result/penalty-rank';
import SurveyResult from '@/components/result/survey-result';
import TopResult from '@/components/result/top-result';
import TopsisResult from '@/components/result/topsis';
import WeightedData from '@/components/result/weighted';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Fetch from '@/lib/fetch';
import { notFound } from 'next/navigation';

type Props = {
    params: {
        username: string;
        id: string;
    };
};

export default async function ResultPage({ params }: Props) {
    const { username, id } = await params;

    let isValid = false;

    try {
        const res = await Fetch.GET(`/dss/${id}/meta/${username}`);

        if (res?.success && res?.data?.id === id && res?.data?.username === username) {
            isValid = true;
        }
    } catch (error) {
        console.error(error);
    }

    if (!isValid) {
        notFound();
    }

    return (
        <main className='space-y-12'>
            <TopResult runId={id} />
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
        </main>
    );
}
