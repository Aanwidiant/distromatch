import ContactSection from './components/contact-section';
import HeroSection from './components/hero-section';
import HowItWorksSection from './components/how-it-works-section';
import StatsSection from './components/stats-section';
import WhatItDoesSection from './components/what-it-does-section';
import WhySection from './components/why-section';

export default function AboutPage() {
    return (
        <main className='p-6 md:px-12 lg:px-20'>
            <div className='mx-auto max-w-330 space-y-16 overflow-hidden py-6'>
                <HeroSection />
                <WhatItDoesSection />
                <HowItWorksSection />
                <WhySection />
                <StatsSection />
                <ContactSection />
            </div>
        </main>
    );
}
