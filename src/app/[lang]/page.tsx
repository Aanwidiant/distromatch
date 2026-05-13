import CtaSection from './landing/components/cta-section';
import FaqSection from './landing/components/faq-section';
import HeroSection from './landing/components/hero-section';
import HowItWorksSection from './landing/components/how-it-works-section';
import PreviewSection from './landing/components/preview-section';
import TargetUsersSection from './landing/components/target-users-section';
import ValuePropsSection from './landing/components/value-props-section';

export default async function LandingPage() {
    return (
        <main className='p-6 md:px-12 lg:px-20'>
            <div className='mx-auto max-w-330 space-y-16 overflow-hidden py-6'>
                <HeroSection />
                <ValuePropsSection />
                <HowItWorksSection />
                <PreviewSection />
                <TargetUsersSection />
                <FaqSection />
                <CtaSection />
            </div>
        </main>
    );
}
