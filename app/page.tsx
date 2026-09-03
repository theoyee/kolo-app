import Navbar from '@/components/landing-page/Navbar';
import { FeaturesSection } from '@/components/landing-page/Features';
import { PricingSection } from '@/components/landing-page/Pricing';
import Footer from '@/components/landing-page/Footer';
import HeroSection from '@/components/landing-page/Hero';
import { ResourcesSection } from '@/components/landing-page/Resources';
import { ProductShowcase } from '@/components/landing-page/Products';
import { Testimonials } from '@/components/landing-page/Testimonials';
// import DashboardMockup from '@/components/landing-page/DashboardMockup';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7F4EE] to-white text-[#10201a] font-sans selection:bg-kolo-navy selection:text-white">
      <Navbar />
      <main className='flex flex-col space-y10 overflow-x-hidden '>
        <HeroSection />
        {/* <DashboardMockup className='perspective-distant' /> */}
        <FeaturesSection />

        <ProductShowcase />
        <PricingSection />
        <ResourcesSection />


        <Testimonials />

      </main>
      <Footer />
    </div>
  );
}