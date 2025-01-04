import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import BenefitsSection from '@/components/BenefitsSection';
import PricingSection from '@/components/PricingSection';
import FAQSection from '@/components/FAQSection';
import AboutUsSection from '@/components/AboutUsSection';
import ContactSection from '@/components/ContactSection';
import NewsletterSection from '@/components/NewsletterSection';
import Footer from '@/components/Footer';

export default function Home() {
	return (
		<main className='w-full flex flex-col items-center justify-center '>
			<HeroSection />
			<FeaturesSection />
			<HowItWorksSection />
			<TestimonialsSection />
			<BenefitsSection />
			{/* <PricingSection /> */}
			<FAQSection />
			<AboutUsSection />
			<ContactSection />
			<NewsletterSection />
			
		</main>
	);
}
