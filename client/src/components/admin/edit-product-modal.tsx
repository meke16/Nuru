import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { insertProductSchema, type InsertProduct, type Product } from "@shared/schema";

interface EditProductModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

export default function EditProductModal({ product, open, onClose }: EditProductModalProps) {
  const { toast } = useToast();

  const form = useForm<InsertProduct>({
    resolver: zodResolver(insertProductSchema),
    defaultValues: {
      name: "",
      brand: "",
      description: "",
      category: "",
      price: "0",
      stock: 0,
      sku: "",
      imageUrl: "",
      specifications: "",
      isActive: true,
    },
  });

  // Update form when product changes
  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name || "",
        brand: product.brand || "",
        description: product.description || "",
        category: product.category || "",
        price: product.price || "0",
        stock: product.stock || 0,
        sku: product.sku || "",
        imageUrl: product.imageUrl || "",
        specifications: product.specifications || "",
        isActive: product.isActive ?? true,
      });
    }
  }, [product, form]);

  const updateProductMutation = useMutation({
    mutationFn: async (productData: InsertProduct) => {
      const response = await apiRequest("PUT", `/api/products/${product?.id}`, productData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics"] });
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
      onClose();
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
        description: "Failed to update product",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertProduct) => {
    updateProductMutation.mutate(data);
  };

  const categories = [
    "Smartphone",
    "Tablet", 
    "Laptop",
    "Headphones",
    "Smart Watch",
    "Accessories",
  ];

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-screen overflow-y-auto" data-testid="edit-product-modal">
        <DialogHeader>
          <DialogTitle data-testid="modal-title">Edit Product</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" data-testid="edit-product-form">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel data-testid="label-name">Product Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="iPhone 15 Pro Max"
                        {...field}
                        data-testid="input-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel data-testid="label-brand">Brand</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Apple"
                        {...field}
                        data-testid="input-brand"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel data-testid="label-category">Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} data-testid="select-category">
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel data-testid="label-price">Price (ETB)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="999.99"
                        {...field}
                        data-testid="input-price"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel data-testid="label-stock">Stock Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="10"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        data-testid="input-stock"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel data-testid="label-sku">SKU</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="SKU-001"
                        {...field}
                        data-testid="input-sku"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel data-testid="label-description">Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Product description..."
                          rows={3}
                          {...field}
                          data-testid="input-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel data-testid="label-image-url">Image URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/image.jpg"
                          {...field}
                          data-testid="input-image-url"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="specifications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel data-testid="label-specifications">Specifications (JSON format)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='{"Storage": "256GB", "RAM": "8GB", "Display": "6.1 inch"}'
                          rows={3}
                          {...field}
                          data-testid="input-specifications"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base" data-testid="label-active">
                          Active Product
                        </FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Display this product on the website
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="switch-active"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex space-x-4 pt-4">
              <Button 
                type="submit" 
                className="flex-1"
                disabled={updateProductMutation.isPending}
                data-testid="button-update"
              >
                {updateProductMutation.isPending ? (
                  <>
                    <LoadingSpinner className="w-4 h-4 mr-2" />
                    Updating...
                  </>
                ) : (
                  "Update Product"
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}