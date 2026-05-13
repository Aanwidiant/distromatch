import { ThemeProvider } from '@/providers/theme-provider';
import './styles/globals.css';
import { Poppins } from 'next/font/google';
import { Toaster } from 'sonner';
import ThemeTransition from '@/components/theme/theme-transition';
import AuthProvider from '@/providers/auth-provider';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { CircleCheck, CircleX, Info } from 'lucide-react';

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang='en' suppressHydrationWarning>
            <body className={`${poppins.className}`}>
                <ThemeProvider
                    attribute='class'
                    defaultTheme='system'
                    enableSystem
                    disableTransitionOnChange
                >
                    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
                        <AuthProvider>
                            {children}
                            <Toaster
                                position='bottom-right'
                                icons={{
                                    success: <CircleCheck className='size-6' />,
                                    error: <CircleX className='size-6' />,
                                    info: <Info className='size-6' />,
                                }}
                                duration={5000}
                                toastOptions={{
                                    classNames: {
                                        toast: `${poppins.className} transition-all duration-500 bg-bg-2! text-foreground! ease-in-out border border-stroke! shadow-grey-1 shadow-sm min-h-16`,
                                    },
                                }}
                            />
                        </AuthProvider>
                    </GoogleOAuthProvider>
                    <ThemeTransition />
                </ThemeProvider>
            </body>
        </html>
    );
}
