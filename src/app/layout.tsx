import { ThemeProvider } from '@/providers/theme-provider';
import './styles/globals.css';
import { Poppins } from 'next/font/google';
import { Toaster } from 'sonner';
import { ChecklistCircle, CircleInfo } from '@/components/icons';
import ThemeTransition from '@/components/theme/theme-transition';
import AuthProvider from '@/providers/auth-provider';
import { GoogleOAuthProvider } from '@react-oauth/google';
import DialogProvider from '@/providers/dialog-provider';

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
                            <DialogProvider />
                            <Toaster
                                position='bottom-right'
                                icons={{
                                    success: <ChecklistCircle className='fill-primary size-6' />,
                                    error: <CircleInfo className='size-6' />,
                                    info: <CircleInfo className='size-6 rotate-180' />,
                                }}
                                duration={5000}
                            />
                        </AuthProvider>
                    </GoogleOAuthProvider>
                    <ThemeTransition />
                </ThemeProvider>
            </body>
        </html>
    );
}
