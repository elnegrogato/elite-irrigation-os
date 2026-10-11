// scripts/seedAdmin.ts
// Run this with: npx tsx scripts/seedAdmin.ts

import { convexToJson, jsonToConvex } from "../convex/_generated/api";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

// Simple password hash function (same as in auth.ts)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "elite_irrigation_salt");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

async function main() {
  console.log("Creating admin user...");

  // In a real implementation, you would use the Convex client to insert this user
  // For now, this is just a reference implementation

  const adminUser = {
    name: "Admin User",
    email: "admin@eliteirrigation.com",
    phone: "+15551234567",
    passwordHash: await hashPassword("admin123"),
    role: "admin",
    status: "active",
    createdAt: Date.now(),
  };

  console.log("Admin user data:", adminUser);
  console.log("\nTo insert this user into your Convex database:");
  console.log("1. Go to your Convex dashboard");
  console.log("2. Navigate to the 'users' table");
  console.log("3. Insert the above JSON data");
  console.log("\nDefault credentials:");
  console.log("Email: admin@eliteirrigation.com");
  console.log("Password: admin123");
  console.log("\nIMPORTANT: Change the password after first login!");
}

main().catch(console.error);
