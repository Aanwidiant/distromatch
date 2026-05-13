import Fetch from '@/lib/fetch';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { BlockMath } from 'react-katex';
import { FORMULAS } from '@/lib/formulas';
import 'katex/dist/katex.min.css';
import { getTranslations } from 'next-intl/server';

type SurveyQuestions = {
    q1_ux: number;
    q2_ux: number;
    q3_performance: number;
    q4_performance: number;
    q5_stability: number;
    q6_stability: number;
    q7_features: number;
    q8_features: number;
    q9_support: number;
    q10_support: number;
    q11_level_pref: number;
    q12_level_pref: number;
};

type SurveySummary = {
    ux: { mean: number; weight: number };
    performance: { mean: number; weight: number };
    stability: { mean: number; weight: number };
    features: { mean: number; weight: number };
    support: { mean: number; weight: number };
    preference: { level: string; score: number };
};

type SurveyData = {
    questions: SurveyQuestions;
    summary: SurveySummary;
};

type ApiResponse<T> = {
    success: boolean;
    data: T;
};

type Props = {
    runId: string;
};

export default async function SurveyResult({ runId }: Props) {
    let data: SurveyData | null = null;
    const t = await getTranslations('result.survey');

    try {
        const res = await Fetch.GET<ApiResponse<SurveyData>>(`/dss/${runId}/survey`);

        if (res.success) {
            data = res.data;
        }
    } catch (error) {
        console.error('Fetch survey error:', error);
    }

    if (!data) {
        return <div>{t('status.failed')}</div>;
    }

    const { questions, summary } = data;

    const rows = [
        {
            label: `Q1 ${t('table.qUx')}`,
            answer: questions.q1_ux,
            mean: summary.ux.mean,
            weight: summary.ux.weight,
        },
        {
            label: `Q2 ${t('table.qUx')}`,
            answer: questions.q2_ux,
        },
        {
            label: `Q3 ${t('table.qPerformance')}`,
            answer: questions.q3_performance,
            mean: summary.performance.mean,
            weight: summary.performance.weight,
        },
        {
            label: `Q4 ${t('table.qPerformance')}`,
            answer: questions.q4_performance,
        },
        {
            label: `Q5 ${t('table.qStability')}`,
            answer: questions.q5_stability,
            mean: summary.stability.mean,
            weight: summary.stability.weight,
        },
        {
            label: `Q6 ${t('table.qStability')}`,
            answer: questions.q6_stability,
        },
        {
            label: `Q7 ${t('table.qFeatures')}`,
            answer: questions.q7_features,
            mean: summary.features.mean,
            weight: summary.features.weight,
        },
        {
            label: `Q8 ${t('table.qFeatures')}`,
            answer: questions.q8_features,
        },
        {
            label: `Q9 ${t('table.qSupport')}`,
            answer: questions.q9_support,
            mean: summary.support.mean,
            weight: summary.support.weight,
        },
        {
            label: `Q10 ${t('table.qSupport')}`,
            answer: questions.q10_support,
        },
        {
            label: `Q11 ${t('table.qPreference')}`,
            answer: questions.q11_level_pref,
            mean: summary.preference.score,
            weight: summary.preference.level,
        },
        {
            label: `Q12 ${t('table.qPreference')}`,
            answer: questions.q12_level_pref,
        },
    ];

    return (
        <div className='grid w-full gap-6 lg:grid-cols-3'>
            <div className='bg-background border-stroke overflow-x-auto rounded-2xl border lg:col-span-2'>
                <div className='border-stroke border-b p-5'>
                    <h2 className='text-xl font-semibold'>{t('title')}</h2>
                    <p className='text-muted-foreground text-sm'>{t('description')}</p>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow className='bg-bg-2 hover:bg-bg-2'>
                            <TableHead className='min-w-55 font-semibold'>
                                {t('table.columnQuestions')}
                            </TableHead>
                            <TableHead className='text-center font-semibold'>
                                {t('table.columnAnswer')}
                            </TableHead>
                            <TableHead className='text-center font-semibold'>
                                {t('table.columnMean')}
                            </TableHead>
                            <TableHead className='text-right font-semibold'>
                                {t('table.columnWeight')}
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {rows.map((row, i) => (
                            <TableRow key={i}>
                                <TableCell className='font-medium'>{row.label}</TableCell>

                                <TableCell className='text-center'>
                                    <span className='bg-accent-1 inline-flex min-w-8 items-center justify-center rounded-md px-2 py-1 text-sm font-medium'>
                                        {row.answer}
                                    </span>
                                </TableCell>

                                <TableCell className='text-center'>
                                    {row.mean !== undefined ? (
                                        <span className='text-muted-foreground font-medium'>
                                            {row.mean.toFixed(2)}
                                        </span>
                                    ) : (
                                        '-'
                                    )}
                                </TableCell>

                                <TableCell className='text-right font-medium'>
                                    {row.weight !== undefined
                                        ? typeof row.weight === 'number'
                                            ? row.weight.toFixed(2)
                                            : row.weight
                                        : '-'}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* FORMULA CARD */}
            <div className='space-y-5'>
                <div className='bg-background border-stroke rounded-2xl border p-5'>
                    <h2 className='mb-1 text-xl font-semibold'>{t('calculation.title')}</h2>

                    <p className='text-muted-foreground text-sm'>{t('calculation.description')}</p>
                </div>

                <div className='bg-background border-stroke space-y-6 rounded-2xl border p-5'>
                    <div className='space-y-2'>
                        <h3 className='text-base font-semibold'>{t('calculation.avgDimension')}</h3>

                        <div className='bg-bg-2 overflow-x-auto rounded-xl p-4'>
                            <BlockMath math={FORMULAS.surveyAverages} />
                        </div>
                    </div>

                    <div className='space-y-2'>
                        <h3 className='text-base font-semibold'>{t('calculation.totalScore')}</h3>

                        <div className='bg-bg-2 overflow-x-auto rounded-xl p-4'>
                            <BlockMath math={FORMULAS.surveyTotal} />
                        </div>
                    </div>

                    <div className='space-y-2'>
                        <h3 className='text-base font-semibold'>
                            {t('calculation.weightFormula')}
                        </h3>

                        <div className='bg-bg-2 overflow-x-auto rounded-xl p-4'>
                            <BlockMath math={FORMULAS.weights} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
