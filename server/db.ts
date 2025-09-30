import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL is not set!");
  console.error("🔧 Add PostgreSQL database in Railway:");
  console.error("   1. Go to Railway dashboard");
  console.error("   2. Click '+ New' → 'Database' → 'Add PostgreSQL'");
  console.error("   3. Railway will set DATABASE_URL automatically");
  throw new Error(
    "DATABASE_URL must be set. Add PostgreSQL database in Railway.",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });