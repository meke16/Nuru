import { MapPin, Phone, Mail } from "lucide-react";

export default function ContactSection() {
  const contactInfo = [
    {
      icon: MapPin,
      title: "Location",
      details: ["Bole Road, Addis Ababa", "Near Edna Mall"],
    },
    {
      icon: Phone,
      title: "Phone",
      details: ["+251 911 123 456", "+251 911 654 321"],
    },
    {
      icon: Mail,
      title: "Email",
      details: ["info@nurmobile.et", "sales@nurmobile.et"],
    },
  ];

  return (
    <section id="contact" className="py-16 bg-background" data-testid="contact-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="contact-title">
            Get in Touch
          </h2>
          <p className="text-muted-foreground text-lg" data-testid="contact-description">
            Visit our store or contact us for the best deals on electronics
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {contactInfo.map(({ icon: Icon, title, details }, index) => (
            <div key={index} className="text-center" data-testid={`contact-item-${index}`}>
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2" data-testid={`contact-title-${index}`}>
                {title}
              </h3>
              <div data-testid={`contact-details-${index}`}>
                {details.map((detail, detailIndex) => (
                  <p key={detailIndex} className="text-muted-foreground">
                    {detail}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
