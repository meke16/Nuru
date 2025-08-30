import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import FeaturedProducts from "@/components/featured-products";
import AboutSection from "@/components/about-section";
import ContactSection from "@/components/contact-section";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground" data-testid="landing-page">
      <Navigation />
      <main>
        <HeroSection />
        <FeaturedProducts />
        <AboutSection />
        <ContactSection />
      </main>
    </div>
  );
}
