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
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

type Props = {
    params: {
        username: string;
        id: string;
        lang: string;
    };
};

export default async function ResultPage({ params }: Props) {
    const { username, id, lang } = await params;
    const t = await getTranslations('result.resultPage.tabs');

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
        <main className='p-6 md:px-12 lg:px-20'>
            <div className='mx-auto max-w-330 space-y-8 overflow-hidden py-6'>
                <TopResult runId={id} lang={lang} />
                <Tabs defaultValue='survey' className='space-y-3'>
                    <div className='no-scrollbar overflow-x-auto overflow-y-hidden'>
                        <TabsList variant='line' className='flex h-fit w-max min-w-full gap-2'>
                            <TabsTrigger value='survey'>{t('survey')}</TabsTrigger>
                            <TabsTrigger value='distro'>{t('distro')}</TabsTrigger>
                            <TabsTrigger value='normalize'>{t('normalize')}</TabsTrigger>
                            <TabsTrigger value='norm-weight'>{t('weighted')}</TabsTrigger>
                            <TabsTrigger value='topsis'>{t('topsis')}</TabsTrigger>
                            <TabsTrigger value='bayesian'>{t('bayesian')}</TabsTrigger>
                            <TabsTrigger value='penalty'>{t('penalty')}</TabsTrigger>
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
        </main>
    );
}
