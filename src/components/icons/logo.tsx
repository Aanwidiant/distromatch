import { SVGProps } from 'react';

export const Logo = (props: SVGProps<SVGSVGElement>) => (
    <svg
        {...props}
        width='300'
        height='300'
        viewBox='0 0 300 300'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
    >
        <g clipPath='url(#clip0_472_249)'>
            <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M251.188 98.0471V200.141C251.188 228.314 228.315 251.188 200.141 251.188H98.047C69.874 251.188 47 228.315 47 200.141V98.0471C47 69.8741 69.873 47 98.047 47H200.141C228.314 47 251.188 69.8731 251.188 98.0471Z'
                fill='#315FCF'
            />
            <path
                d='M133.576 215.83L132.923 215.769C105.322 213.002 85.0002 188.544 87.4248 160.829C89.8688 132.897 114.494 112.235 142.426 114.679L133.576 215.83Z'
                fill='white'
            />
            <path
                d='M177.986 87.85L204.457 75.5634L193.134 204.981C192.364 213.784 184.603 220.296 175.801 219.526L141.162 216.495L153.884 71.0889L153.969 71.0964L177.986 87.85Z'
                fill='white'
            />
        </g>
        <defs>
            <clipPath id='clip0_472_249'>
                <rect width='205' height='205' fill='white' transform='translate(47 47)' />
            </clipPath>
        </defs>
    </svg>
);
