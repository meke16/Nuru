import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { queryClient, apiRequest } from "@/lib/queryClient";
import AddProductModal from "@/components/admin/add-product-modal";
import EditProductModal from "@/components/admin/edit-product-modal";
import type { Product } from "@shared/schema";

export default function ProductManagement() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (productId: string) => {
      await apiRequest("DELETE", `/api/products/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    },
  });

  const formatPrice = (price: string | number) => {
    return `${Number(price).toLocaleString()} ETB`;
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: "Out of Stock", variant: "destructive" as const };
    if (stock <= 5) return { label: "Low Stock", variant: "secondary" as const };
    return { label: "In Stock", variant: "default" as const };
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProductMutation.mutate(productId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12" data-testid="products-loading">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div data-testid="product-management">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground" data-testid="products-title">
            Product Management
          </h2>
          <p className="text-muted-foreground" data-testid="products-description">
            Add, edit, and manage your product inventory
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          data-testid="button-add-product"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full" data-testid="products-table">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-4 font-medium text-foreground">Product</th>
                  <th className="text-left p-4 font-medium text-foreground">Category</th>
                  <th className="text-left p-4 font-medium text-foreground">Price</th>
                  <th className="text-left p-4 font-medium text-foreground">Stock</th>
                  <th className="text-left p-4 font-medium text-foreground">Status</th>
                  <th className="text-left p-4 font-medium text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center">
                      <p className="text-muted-foreground" data-testid="no-products">
                        No products found. Add your first product to get started.
                      </p>
                    </td>
                  </tr>
                ) : (
                  products.map((product) => {
                    const stockStatus = getStockStatus(product.stock);
                    return (
                      <tr key={product.id} data-testid={`product-row-${product.id}`}>
                        <td className="p-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-muted rounded mr-3 flex items-center justify-center">
                              {product.imageUrl ? (
                                <img
                                  src={product.imageUrl}
                                  alt={product.name}
                                  className="w-full h-full object-cover rounded"
                                />
                              ) : (
                                <span className="text-xs">📱</span>
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-foreground" data-testid={`product-name-${product.id}`}>
                                {product.name}
                              </div>
                              {product.brand && (
                                <div className="text-sm text-muted-foreground" data-testid={`product-brand-${product.id}`}>
                                  {product.brand}
                                </div>
                              )}
                              <div className="text-sm text-muted-foreground" data-testid={`product-sku-${product.id}`}>
                                SKU: {product.sku || "N/A"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-foreground" data-testid={`product-category-${product.id}`}>
                          {product.category}
                        </td>
                        <td className="p-4 text-foreground" data-testid={`product-price-${product.id}`}>
                          {formatPrice(product.price)}
                        </td>
                        <td className="p-4 text-foreground" data-testid={`product-stock-${product.id}`}>
                          {product.stock}
                        </td>
                        <td className="p-4">
                          <Badge variant={stockStatus.variant} data-testid={`product-status-${product.id}`}>
                            {stockStatus.label}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-primary hover:text-primary/80"
                              onClick={() => setEditingProduct(product)}
                              data-testid={`button-edit-${product.id}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive/80"
                              onClick={() => handleDeleteProduct(product.id)}
                              disabled={deleteProductMutation.isPending}
                              data-testid={`button-delete-${product.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <AddProductModal 
        open={showAddModal} 
        onClose={() => setShowAddModal(false)} 
      />
      
      <EditProductModal
        product={editingProduct}
        open={!!editingProduct}
        onClose={() => setEditingProduct(null)}
      />
    </div>
  );
}
