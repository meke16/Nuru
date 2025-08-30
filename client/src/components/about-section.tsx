import { Shield, Wrench, Truck } from "lucide-react";
import ownerImage2 from "@assets/nuru02_1756361383448.jpg";

export default function AboutSection() {
  const features = [
    { icon: Shield, label: "Authentic Products" },
    { icon: Wrench, label: "Expert Support" },
    { icon: Truck, label: "Fast Delivery" },
  ];

  return (
    <section id="about" className="py-16 bg-muted" data-testid="about-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" data-testid="about-title">
              About Nur Mobile
            </h2>
            <p className="text-muted-foreground text-lg mb-6" data-testid="about-description">
              With over 5 years of experience in the electronics industry, Nur Mobile has become the trusted destination for premium smartphones and electronics in Ethiopia. We pride ourselves on offering authentic products with competitive prices and exceptional customer service.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary" data-testid="stat-customers">500+</div>
                <div className="text-muted-foreground">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary" data-testid="stat-products-sold">1000+</div>
                <div className="text-muted-foreground">Products Sold</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              {features.map(({ icon: Icon, label }, index) => (
                <div key={index} className="flex items-center text-muted-foreground" data-testid={`feature-${index}`}>
                  <Icon className="h-5 w-5 text-primary mr-2" />
                  {label}
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6">
            <div className="relative">
              <img
                src={ownerImage2}
                alt="Nur Mobile Store Owner"
                className="rounded-lg shadow-lg w-full object-cover aspect-[4/3]"
                data-testid="about-image"
              />
              <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-lg">
                <p className="font-semibold">Meet Our Owner</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
