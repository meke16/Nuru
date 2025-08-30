import { db } from "./db";
import { storage } from "./storage";
import { hashPassword } from "./auth";

async function setupDefaultAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await storage.getAdminByUsername("admin");
    
    if (existingAdmin) {
      console.log("Admin user already exists");
      return;
    }

    // Create default admin user
    const passwordHash = await hashPassword("admin123");
    
    await storage.createAdmin({
      username: "admin",
      passwordHash,
      isActive: true,
    });

    console.log("Default admin user created:");
    console.log("Username: admin");
    console.log("Password: admin123");
    console.log("Please change the password after first login");
    
  } catch (error) {
    console.error("Error setting up admin user:", error);
  }
}

// Run the setup if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupDefaultAdmin().then(() => process.exit(0));
}

export { setupDefaultAdmin };