import React from 'react';
import { Button } from '@/components/ui/button';
import { AnimatedCross } from './animated-sign';

interface FailedVerifyProps {
    onContinue: () => void;
    title?: string;
    description?: string;
    buttonLabel?: string;
}

const FailedVerify: React.FC<FailedVerifyProps> = ({
    onContinue,
    title = 'Verification Failed',
    description = 'We could not verify your request. The link may be invalid or expired.',
    buttonLabel = 'Go to Home',
}) => {
    return (
        <div className='bg-background flex w-full flex-col items-center justify-center gap-8'>
            <div className='flex w-full flex-row items-center justify-center'>
                <div className='bg-destructive ring-destructive/30 flex size-24 items-center justify-center rounded-full p-5 ring-4 md:size-28'>
                    <AnimatedCross className='mx-auto stroke-white' />
                </div>
            </div>
            <div className='flex w-full flex-col items-center justify-center gap-2'>
                <p className='text-xl font-semibold'>{title}</p>
                <p className='text-center font-medium'>{description}</p>
            </div>
            <Button variant='default' onClick={onContinue}>
                {buttonLabel}
            </Button>
        </div>
    );
};

export default FailedVerify;
