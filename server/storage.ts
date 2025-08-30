import {
  users,
  products,
  sales,
  adminCredentials,
  type User,
  type UpsertUser,
  type Product,
  type InsertProduct,
  type Sale,
  type InsertSale,
  type AdminCredential,
  type InsertAdmin,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sum, count, sql } from "drizzle-orm";

export interface IStorage {
  // User operations - mandatory for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Admin operations for username/password auth
  getAdminByUsername(username: string): Promise<AdminCredential | undefined>;
  createAdmin(admin: InsertAdmin): Promise<AdminCredential>;
  
  // Product operations
  getAllProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;
  
  // Sales operations
  createSale(sale: InsertSale): Promise<Sale>;
  getAllSales(): Promise<Sale[]>;
  getRecentSales(limit?: number): Promise<Sale[]>;
  
  // Analytics operations
  getTotalProducts(): Promise<number>;
  getTotalStockValue(): Promise<number>;
  getMonthlySales(): Promise<number>;
  getTotalRevenue(): Promise<number>;
  getLowStockProducts(threshold?: number): Promise<Product[]>;
  getOutOfStockProducts(): Promise<Product[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations - mandatory for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Admin operations for username/password auth
  async getAdminByUsername(username: string): Promise<AdminCredential | undefined> {
    const [admin] = await db.select().from(adminCredentials).where(eq(adminCredentials.username, username));
    return admin;
  }

  async createAdmin(adminData: InsertAdmin): Promise<AdminCredential> {
    const [admin] = await db.insert(adminCredentials).values(adminData).returning();
    return admin;
  }

  // Product operations
  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.isActive, true)).orderBy(desc(products.createdAt));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: string, productData: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updatedProduct] = await db
      .update(products)
      .set({ ...productData, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await db
      .update(products)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(products.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Sales operations
  async createSale(sale: InsertSale): Promise<Sale> {
    const [newSale] = await db.insert(sales).values(sale).returning();
    
    // Update product stock
    if (sale.productId && sale.quantity) {
      await db
        .update(products)
        .set({ 
          stock: sql`stock - ${sale.quantity}`,
          updatedAt: new Date()
        })
        .where(eq(products.id, sale.productId));
    }
    
    return newSale;
  }

  async getAllSales(): Promise<Sale[]> {
    return await db.select().from(sales).orderBy(desc(sales.saleDate));
  }

  async getRecentSales(limit: number = 10): Promise<Sale[]> {
    return await db.select().from(sales).orderBy(desc(sales.saleDate)).limit(limit);
  }

  // Analytics operations
  async getTotalProducts(): Promise<number> {
    const result = await db
      .select({ count: count() })
      .from(products)
      .where(eq(products.isActive, true));
    return result[0]?.count || 0;
  }

  async getTotalStockValue(): Promise<number> {
    const result = await db
      .select({ 
        total: sql<number>`COALESCE(SUM(${products.price} * ${products.stock}), 0)` 
      })
      .from(products)
      .where(eq(products.isActive, true));
    return Number(result[0]?.total || 0);
  }

  async getMonthlySales(): Promise<number> {
    const result = await db
      .select({ count: count() })
      .from(sales)
      .where(sql`${sales.saleDate} >= date_trunc('month', current_date)`);
    return result[0]?.count || 0;
  }

  async getTotalRevenue(): Promise<number> {
    const result = await db
      .select({ 
        total: sql<number>`COALESCE(SUM(${sales.totalAmount}), 0)` 
      })
      .from(sales);
    return Number(result[0]?.total || 0);
  }

  async getLowStockProducts(threshold: number = 5): Promise<Product[]> {
    return await db
      .select()
      .from(products)
      .where(sql`${products.isActive} = true AND ${products.stock} <= ${threshold} AND ${products.stock} > 0`);
  }

  async getOutOfStockProducts(): Promise<Product[]> {
    return await db
      .select()
      .from(products)
      .where(sql`${products.isActive} = true AND ${products.stock} = 0`);
  }

  async updateProduct(id: string, productData: InsertProduct): Promise<Product> {
    const [product] = await db
      .update(products)
      .set({
        ...productData,
        updatedAt: new Date(),
      })
      .where(eq(products.id, id))
      .returning();
    return product;
  }
}

export const storage = new DatabaseStorage();
