import React from 'react';
import { Button } from '@/components/ui/button';
import { AnimatedChecklist } from './animated-sign';

interface SuccessVerifyProps {
    onContinue: () => void;
    countdown: number;
    title?: string;
    description?: string;
    buttonLabel?: string;
}

const SuccessVerify: React.FC<SuccessVerifyProps> = ({
    onContinue,
    countdown,
    title = 'Success!',
    description = 'Verification account successfully',
    buttonLabel = 'Continue to Home',
}) => {
    return (
        <div className='bg-background flex w-full flex-col items-center justify-center gap-8'>
            <div className='flex w-full flex-row items-center justify-center'>
                <div className='bg-primary ring-primary/30 flex size-24 items-center justify-center rounded-full p-5 ring-4 md:size-28'>
                    <AnimatedChecklist className='mx-auto stroke-white' />
                </div>
            </div>
            <div className='flex w-full flex-col items-center justify-center gap-2'>
                <p className='text-xl font-semibold'>{title}</p>
                <p className='font-medium'>{description}</p>
            </div>
            <p className='text-grey-3 text-sm'>
                Redirecting in <span className='font-semibold'>{countdown}</span> seconds...
            </p>
            <Button variant='default' onClick={onContinue}>
                {buttonLabel}
            </Button>
        </div>
    );
};

export default SuccessVerify;
