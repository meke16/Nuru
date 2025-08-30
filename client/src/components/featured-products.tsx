import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import ProductDetailsModal from "@/components/product-details-modal";
import type { Product } from "@shared/schema";

export default function FeaturedProducts() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const categories = [
    { id: "all", label: "All" },
    { id: "smartphones", label: "Smartphones" },
    { id: "tablets", label: "Tablets" },
    { id: "accessories", label: "Accessories" },
  ];

  const filteredProducts = products.filter(product => 
    selectedCategory === "all" || product.category.toLowerCase() === selectedCategory
  );

  const formatPrice = (price: string | number) => {
    return `${Number(price).toLocaleString()} ETB`;
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: "Out of Stock", variant: "destructive" as const };
    if (stock <= 5) return { label: "Low Stock", variant: "secondary" as const };
    return { label: "In Stock", variant: "default" as const };
  };

  return (
    <section id="products" className="py-16 bg-background" data-testid="featured-products">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="products-title">
            Featured Products
          </h2>
          <p className="text-muted-foreground text-lg" data-testid="products-description">
            Discover our latest smartphones and electronics
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2 bg-muted p-1 rounded-lg">
            {categories.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setSelectedCategory(id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedCategory === id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-background"
                }`}
                data-testid={`filter-${id}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-testid="products-grid">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground text-lg" data-testid="no-products">
                  No products found in this category.
                </p>
              </div>
            ) : (
              filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.stock);
                return (
                  <Card key={product.id} className="hover-lift overflow-hidden" data-testid={`product-card-${product.id}`}>
                    <div className="aspect-square bg-muted flex items-center justify-center relative">
                      {/* Stock status indicator */}
                      <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium z-10 ${
                        product.stock === 0 
                          ? 'bg-destructive text-destructive-foreground' 
                          : product.stock <= 5 
                          ? 'bg-amber-500 text-white' 
                          : 'bg-green-500 text-white'
                      }`}>
                        {product.stock === 0 ? 'Out of Stock' : product.stock <= 5 ? 'Low Stock' : 'In Stock'}
                      </div>
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          data-testid={`product-image-${product.id}`}
                        />
                      ) : (
                        <div className="text-muted-foreground text-center p-4">
                          <div className="text-4xl mb-2">📱</div>
                          <p className="text-sm">No image available</p>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold text-foreground mb-2" data-testid={`product-name-${product.id}`}>
                        {product.name}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2" data-testid={`product-description-${product.id}`}>
                        {product.description || "No description available"}
                      </p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xl font-bold text-primary" data-testid={`product-price-${product.id}`}>
                          {formatPrice(product.price)}
                        </span>
                        <Badge variant={stockStatus.variant} data-testid={`product-stock-${product.id}`}>
                          {stockStatus.label}
                        </Badge>
                      </div>
                      <Button 
                        className="w-full" 
                        disabled={product.stock === 0}
                        onClick={() => setSelectedProduct(product)}
                        data-testid={`button-view-details-${product.id}`}
                      >
                        <InfoIcon className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        )}

        {/* Product Details Modal */}
        {selectedProduct && (
          <ProductDetailsModal
            product={selectedProduct}
            open={!!selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </div>
    </section>
  );
}
