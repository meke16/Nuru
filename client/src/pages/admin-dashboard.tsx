import { useState } from "react";
import { LogOut, BarChart3, Package, TrendingUp, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardOverview from "@/components/admin/dashboard-overview";
import ProductManagement from "@/components/admin/product-management";
import InventoryManagement from "@/components/admin/inventory-management";
import SalesAnalytics from "@/components/admin/sales-analytics";

type AdminSection = "dashboard" | "products" | "inventory" | "sales";

export default function AdminDashboard() {
  const [currentSection, setCurrentSection] = useState<AdminSection>("dashboard");

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      window.location.href = "/";
    } catch (error) {
      window.location.href = "/";
    }
  };

  const navigation = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "products", label: "Products", icon: Package },
    { id: "inventory", label: "Inventory", icon: Archive },
    { id: "sales", label: "Sales", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-background" data-testid="admin-dashboard">
      {/* Header */}
      <nav className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary" data-testid="admin-title">
                Nur Mobile Admin
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-muted-foreground" data-testid="welcome-text">
                Welcome, Admin
              </span>
              <Button
                onClick={handleLogout}
                variant="destructive"
                size="sm"
                data-testid="button-logout"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-card border-r border-border">
          <div className="p-4">
            <nav className="space-y-2">
              {navigation.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setCurrentSection(id as AdminSection)}
                  className={`w-full flex items-center px-4 py-2 rounded-md text-left transition-colors ${
                    currentSection === id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary"
                  }`}
                  data-testid={`nav-${id}`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {currentSection === "dashboard" && <DashboardOverview />}
          {currentSection === "products" && <ProductManagement />}
          {currentSection === "inventory" && <InventoryManagement />}
          {currentSection === "sales" && <SalesAnalytics />}
        </div>
      </div>
    </div>
  );
}
