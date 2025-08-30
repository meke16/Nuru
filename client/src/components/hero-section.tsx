import { Smartphone, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const scrollToProducts = () => {
    const element = document.getElementById("products");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="gradient-bg text-primary-foreground py-20"
      data-testid="hero-section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1
            className="text-4xl md:text-6xl font-bold mb-6"
            data-testid="hero-title"
          >
            Welcome to Nur Mobile
          </h1>
          <p
            className="text-xl md:text-2xl mb-8 opacity-90"
            data-testid="hero-description"
          >
            Your trusted partner for premium smartphones and electronics
          </p>
          <div className="flex justify-center space-x-4">
            <Button
              onClick={scrollToProducts}
              className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 py-3 text-lg"
              data-testid="button-browse-products"
            >
              <Smartphone className="h-5 w-5 mr-2" />
              Browse Products
            </Button>
            <Button
              onClick={scrollToContact}
              variant="outline"
              className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground text-primary px-8 py-3 text-lg"
              data-testid="button-contact-us"
            >
              <Phone className="h-5 w-5 mr-2" />
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
