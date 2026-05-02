import { SVGProps } from 'react';

export const LogoFill = (props: SVGProps<SVGSVGElement>) => (
    <svg
        {...props}
        width='300'
        height='300'
        viewBox='0 0 300 300'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
    >
        <path
            d='M139.576 222.83L138.923 222.769C111.322 220.002 91.0002 195.544 93.4248 167.829C95.8688 139.897 120.494 119.235 148.426 121.679L139.576 222.83Z'
            fill='url(#paint0_linear_472_250)'
        />
        <path
            d='M183.986 94.85L210.457 82.5634L199.134 211.981C198.364 220.784 190.603 227.296 181.801 226.526L147.162 223.495L159.884 78.0889L159.969 78.0964L183.986 94.85Z'
            fill='url(#paint1_linear_472_250)'
        />
        <defs>
            <linearGradient
                id='paint0_linear_472_250'
                x1='123.138'
                y1='119.466'
                x2='114.288'
                y2='220.618'
                gradientUnits='userSpaceOnUse'
            >
                <stop stopColor='#2563EB' />
                <stop offset='1' stopColor='#1D4ED8' />
            </linearGradient>
            <linearGradient
                id='paint1_linear_472_250'
                x1='185.172'
                y1='80.3013'
                x2='172.451'
                y2='225.708'
                gradientUnits='userSpaceOnUse'
            >
                <stop stopColor='#2563EB' />
                <stop offset='1' stopColor='#1D4ED8' />
            </linearGradient>
        </defs>
    </svg>
);
