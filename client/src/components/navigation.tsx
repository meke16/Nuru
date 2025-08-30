import { useState } from "react";
import { Menu, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import logoImage from "@assets/logo_1756361383441.jpg";

export default function Navigation() {
  const [activeSection, setActiveSection] = useState("home");

  const handleLogin = () => {
    window.location.href = "/login";
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(sectionId);
    }
  };

  const navItems = [
    { id: "home", label: "Home" },
    { id: "products", label: "Products" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <nav className="bg-card border-b border-border shadow-sm sticky top-0 z-50" data-testid="navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center space-x-3">
              <img 
                src={logoImage} 
                alt="Nur Mobile Logo" 
                className="h-10 w-10 object-contain rounded"
                data-testid="logo-image"
              />
              <h1 className="text-2xl font-bold text-primary" data-testid="logo">
                Nur Mobile
              </h1>
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                {navItems.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => scrollToSection(id)}
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      activeSection === id
                        ? "text-primary border-b-2 border-primary"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                    data-testid={`nav-${id}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleLogin}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-testid="button-admin-login"
            >
              <Shield className="h-4 w-4 mr-2" />
              Admin Login
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden" data-testid="button-mobile-menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4 mt-6">
                  {navItems.map(({ id, label }) => (
                    <button
                      key={id}
                      onClick={() => scrollToSection(id)}
                      className={`text-left px-4 py-2 rounded-md transition-colors ${
                        activeSection === id
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-secondary"
                      }`}
                      data-testid={`mobile-nav-${id}`}
                    >
                      {label}
                    </button>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
