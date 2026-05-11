export function AnimatedChecklist(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='1.8'
            strokeLinecap='round'
            strokeLinejoin='round'
        >
            <style>
                {`
          .circle {
            stroke-dasharray: 150;
            stroke-dashoffset: 150;
            animation: circleAnim 2.8s cubic-bezier(0.65, 0, 0.35, 1) infinite;
          }
          .check {
            stroke-dasharray: 50;
            stroke-dashoffset: 50;
            animation: checkAnim 2.8s cubic-bezier(0.65, 0, 0.35, 1) infinite;
          }
          @keyframes circleAnim {
            0% {
              stroke-dashoffset: 150;
              opacity: 1;
            }
            45% {
              stroke-dashoffset: 0;
              opacity: 1;
            }
            80% {
              stroke-dashoffset: 0;
              opacity: 1;
            }
            100% {
              stroke-dashoffset: 150;
              opacity: 1;
            }
          }
          @keyframes checkAnim {
            0% {
              stroke-dashoffset: 50;
              opacity: 0;
            }
            45% {
              stroke-dashoffset: 50;
              opacity: 0;
            }
            50% {
              opacity: 1;
            }
            65% {
              stroke-dashoffset: 0;
              opacity: 1;
            }
            80% {
              stroke-dashoffset: 0;
              opacity: 1;
            }
            90% {
              opacity: 0;
            }
            100% {
              stroke-dashoffset: 50;
              opacity: 0;
            }
          }
        `}
            </style>
            <path
                className='circle'
                d='M15.8465 4.07343C12.3548 2.67542 8.10269 3.46248 5.61487 6.20521
           C4.39427 7.55021 3.62879 9.24621 3.42732 11.0519
           C3.22586 12.8575 3.59866 14.6807 4.49266 16.262
           C5.38666 17.8432 6.75628 19.1018 8.40649 19.8586
           C10.0567 20.6154 11.9034 20.8317 13.6836 20.4769
           C17.2904 19.7589 19.9352 16.5137 20.6397 12.9883'
            />
            <path
                className='check'
                d='M8.09467 12.165
           L12.9261 15.8968
           L21.8837 5.07689'
            />
        </svg>
    );
}

export function AnimatedCross(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='1.8'
            strokeLinecap='round'
            strokeLinejoin='round'
        >
            <style>
                {`
          .fail-circle {
            stroke-dasharray: 60;
            stroke-dashoffset: 60;
            animation: failCircleAnim 2.4s cubic-bezier(0.65, 0, 0.35, 1) infinite;
          }
          .fail-line {
            stroke-dasharray: 24;
            stroke-dashoffset: 24;
            animation: failLineAnim 2.4s cubic-bezier(0.65, 0, 0.35, 1) infinite;
          }
          @keyframes failCircleAnim {
            0% {
              stroke-dashoffset: 60;
              opacity: 0.4;
            }
            35% {
              stroke-dashoffset: 0;
              opacity: 1;
            }
            75% {
              stroke-dashoffset: 0;
              opacity: 1;
            }
            100% {
              stroke-dashoffset: 60;
              opacity: 0.4;
            }
          }
          @keyframes failLineAnim {
            0% {
              stroke-dashoffset: 24;
              opacity: 0;
            }
            40% {
              stroke-dashoffset: 24;
              opacity: 0;
            }
            55% {
              stroke-dashoffset: 0;
              opacity: 1;
            }
            80% {
              stroke-dashoffset: 0;
              opacity: 1;
            }
            100% {
              stroke-dashoffset: 24;
              opacity: 0;
            }
          }
        `}
            </style>
            <circle className='fail-circle' cx='12' cy='12' r='9' />
            <path className='fail-line' d='M8 8 L16 16' />
            <path className='fail-line' d='M16 8 L8 16' />
        </svg>
    );
}
