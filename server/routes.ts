import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./auth";
import { insertProductSchema, insertSaleSchema } from "@shared/schema";
import { z } from "zod";

import { adminCredentials } from "@shared/schema";
import { db } from "./db"; 
import bcrypt from "bcryptjs";


export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes are handled in setupAuth function

  // Check if an admin exists
  app.get("/api/setup/check", async (req, res) => {
    try {
      const admin = await db.select().from(adminCredentials).limit(1);
      res.json({ needsSetup: admin.length === 0 });
    } catch (err) {
      console.error("Error checking admin:", err);
      res.status(500).json({ error: "Failed to check admin" });
    }
  });

// Create admin account if none exists
app.post("/api/setup", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if admin exists
    const existingAdmin = await db.select().from(adminCredentials).limit(1);
    if (existingAdmin.length > 0) {
      return res.status(400).json({ error: "Admin already exists" });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert new admin
    await db.insert(adminCredentials).values({
      username,
      passwordHash,
    });

    res.json({ message: "Admin created" });
  } catch (err) {
    console.error("Setup error:", err);
    res.status(500).json({ error: "Failed to create admin" });
  }
});
  
  // Product routes
  app.get('/api/products', async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get('/api/products/:id', async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post('/api/products', isAuthenticated, async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.put('/api/products/:id', isAuthenticated, async (req, res) => {
    try {
      const productData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(req.params.id, productData);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.put('/api/products/:id', isAuthenticated, async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.updateProduct(req.params.id, productData);
      res.json(product);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete('/api/products/:id', isAuthenticated, async (req, res) => {
    try {
      const success = await storage.deleteProduct(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Sales routes
  app.post('/api/sales', isAuthenticated, async (req, res) => {
    try {
      const saleData = insertSaleSchema.parse(req.body);
      const sale = await storage.createSale(saleData);
      res.status(201).json(sale);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid sale data", errors: error.errors });
      }
      console.error("Error creating sale:", error);
      res.status(500).json({ message: "Failed to create sale" });
    }
  });

  app.get('/api/sales', isAuthenticated, async (req, res) => {
    try {
      const sales = await storage.getAllSales();
      res.json(sales);
    } catch (error) {
      console.error("Error fetching sales:", error);
      res.status(500).json({ message: "Failed to fetch sales" });
    }
  });

  app.get('/api/sales/recent', isAuthenticated, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const sales = await storage.getRecentSales(limit);
      res.json(sales);
    } catch (error) {
      console.error("Error fetching recent sales:", error);
      res.status(500).json({ message: "Failed to fetch recent sales" });
    }
  });

  // Analytics routes
  app.get('/api/analytics/overview', isAuthenticated, async (req, res) => {
    try {
      const [totalProducts, stockValue, monthlySales, totalRevenue] = await Promise.all([
        storage.getTotalProducts(),
        storage.getTotalStockValue(),
        storage.getMonthlySales(),
        storage.getTotalRevenue(),
      ]);

      res.json({
        totalProducts,
        stockValue,
        monthlySales,
        totalRevenue,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  app.get('/api/analytics/inventory', isAuthenticated, async (req, res) => {
    try {
      const [lowStockProducts, outOfStockProducts] = await Promise.all([
        storage.getLowStockProducts(),
        storage.getOutOfStockProducts(),
      ]);

      res.json({
        lowStockProducts,
        outOfStockProducts,
        lowStockCount: lowStockProducts.length,
        outOfStockCount: outOfStockProducts.length,
      });
    } catch (error) {
      console.error("Error fetching inventory analytics:", error);
      res.status(500).json({ message: "Failed to fetch inventory analytics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
