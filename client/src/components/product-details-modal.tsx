import { useState } from "react";
import { X, Star, Package, Truck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Product } from "@shared/schema";

interface ProductDetailsModalProps {
  product: Product;
  open: boolean;
  onClose: () => void;
}

export default function ProductDetailsModal({ product, open, onClose }: ProductDetailsModalProps) {
  const formatPrice = (price: string | number) => {
    return `${Number(price).toLocaleString()} ETB`;
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: "Out of Stock", variant: "destructive" as const };
    if (stock <= 5) return { label: "Low Stock", variant: "secondary" as const };
    return { label: "In Stock", variant: "default" as const };
  };

  const stockStatus = getStockStatus(product.stock);

  // Parse specifications from JSON string
  let specifications: Record<string, string> = {};
  try {
    if (product.specifications) {
      specifications = JSON.parse(product.specifications);
    }
  } catch (error) {
    // If parsing fails, treat as empty
    specifications = {};
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-screen overflow-y-auto" data-testid="product-details-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between" data-testid="modal-title">
            <span>Product Details</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              data-testid="button-close"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
              {/* Stock status indicator */}
              <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium z-10 ${
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
                  data-testid="product-image"
                />
              ) : (
                <div className="text-muted-foreground text-center p-8">
                  <div className="text-6xl mb-4">📱</div>
                  <p className="text-lg">No image available</p>
                </div>
              )}
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2" data-testid="product-name">
                {product.name}
              </h1>
              {product.brand && (
                <p className="text-lg text-muted-foreground mb-2" data-testid="product-brand">
                  by {product.brand}
                </p>
              )}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-bold text-primary" data-testid="product-price">
                  {formatPrice(product.price)}
                </span>
                <Badge variant={stockStatus.variant} data-testid="product-stock-badge">
                  {stockStatus.label}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package className="h-4 w-4" />
                <span data-testid="product-category">Category: {product.category}</span>
              </div>
              {product.sku && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <span data-testid="product-sku">SKU: {product.sku}</span>
                </div>
              )}
            </div>

            <Separator />

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed" data-testid="product-description">
                  {product.description}
                </p>
              </div>
            )}

            {/* Specifications */}
            {Object.keys(specifications).length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Specifications</h3>
                <div className="space-y-2" data-testid="product-specifications">
                  {Object.entries(specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center py-2 border-b border-border">
                      <span className="font-medium text-foreground">{key}:</span>
                      <span className="text-muted-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Stock Information */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Availability</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {product.stock > 0 ? `${product.stock} units in stock` : 'Currently out of stock'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {product.stock > 0 ? 'Available for delivery' : 'Notify when back in stock'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                className="flex-1" 
                disabled={product.stock === 0}
                data-testid="button-contact"
              >
                Contact for Purchase
              </Button>
              <Button 
                variant="outline" 
                onClick={onClose}
                data-testid="button-close-modal"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}