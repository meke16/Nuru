import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, XCircle, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import type { Product } from "@shared/schema";

interface InventoryData {
  lowStockProducts: Product[];
  outOfStockProducts: Product[];
  lowStockCount: number;
  outOfStockCount: number;
}

export default function InventoryManagement() {
  const { data: inventory, isLoading } = useQuery<InventoryData>({
    queryKey: ["/api/analytics/inventory"],
  });

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const totalItems = products.reduce((sum, product) => sum + product.stock, 0);

  const inventoryStats = [
    {
      title: "Low Stock Items",
      value: inventory?.lowStockCount || 0,
      icon: AlertTriangle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      title: "Out of Stock",
      value: inventory?.outOfStockCount || 0,
      icon: XCircle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      title: "Total Items",
      value: totalItems,
      icon: Package,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12" data-testid="inventory-loading">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div data-testid="inventory-management">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground" data-testid="inventory-title">
          Inventory Management
        </h2>
        <p className="text-muted-foreground" data-testid="inventory-description">
          Monitor stock levels and manage inventory
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {inventoryStats.map(({ title, value, icon: Icon, color, bgColor }, index) => (
          <Card key={index} data-testid={`inventory-stat-${index}`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm" data-testid={`stat-title-${index}`}>
                    {title}
                  </p>
                  <p className={`text-2xl font-bold ${title.includes("Stock") || title.includes("Out") ? "text-destructive" : "text-foreground"}`} data-testid={`stat-value-${index}`}>
                    {value}
                  </p>
                </div>
                <div className={`${bgColor} p-3 rounded-full`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stock Alerts */}
      <Card data-testid="stock-alerts">
        <CardHeader>
          <CardTitle>Stock Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inventory?.lowStockProducts.length === 0 && inventory?.outOfStockProducts.length === 0 ? (
              <p className="text-center text-muted-foreground py-8" data-testid="no-alerts">
                No stock alerts at the moment. All products are well-stocked!
              </p>
            ) : (
              <>
                {inventory?.outOfStockProducts.map((product) => (
                  <div
                    key={`out-${product.id}`}
                    className="flex items-center justify-between p-4 bg-destructive/10 rounded-lg"
                    data-testid={`alert-out-of-stock-${product.id}`}
                  >
                    <div className="flex items-center">
                      <XCircle className="h-5 w-5 text-destructive mr-3" />
                      <div>
                        <div className="font-medium text-foreground" data-testid={`alert-product-name-${product.id}`}>
                          {product.name}
                        </div>
                        <div className="text-sm text-muted-foreground">Out of stock</div>
                      </div>
                    </div>
                    <Button size="sm" data-testid={`button-restock-${product.id}`}>
                      Restock
                    </Button>
                  </div>
                ))}
                {inventory?.lowStockProducts.map((product) => (
                  <div
                    key={`low-${product.id}`}
                    className="flex items-center justify-between p-4 bg-destructive/10 rounded-lg"
                    data-testid={`alert-low-stock-${product.id}`}
                  >
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 text-destructive mr-3" />
                      <div>
                        <div className="font-medium text-foreground" data-testid={`alert-product-name-${product.id}`}>
                          {product.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Only {product.stock} units remaining
                        </div>
                      </div>
                    </div>
                    <Button size="sm" data-testid={`button-restock-${product.id}`}>
                      Restock
                    </Button>
                  </div>
                ))}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
