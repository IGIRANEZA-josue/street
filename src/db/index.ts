import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

type Db = NodePgDatabase<typeof schema>;

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

let dbInstance: Db | undefined;

/**
 * Creates the Drizzle client on first use. The DATABASE_URL check lives here
 * instead of at module scope so that importing this module never throws —
 * `next build` (page-data collection) succeeds on hosts like Render where the
 * env var is only available at runtime. The error only surfaces when a query
 * is actually executed without DATABASE_URL configured.
 */
function getDb(): Db {
  if (dbInstance) return dbInstance;

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is required to query the database. Set it in your environment (e.g. as a Render environment variable pointing at your PostgreSQL instance) and redeploy.",
    );
  }

  const pool =
    globalForDb.__arenaNextJsPostgresqlPool ??
    new Pool({
      connectionString: databaseUrl,
    });

  // Reuse the pool across hot reloads in development.
  if (process.env.NODE_ENV !== "production") {
    globalForDb.__arenaNextJsPostgresqlPool = pool;
  }

  dbInstance = drizzle(pool);
  return dbInstance;
}

export const db: Db = new Proxy({} as Db, {
  get(_target, prop) {
    const instance = getDb();
    const value = Reflect.get(instance, prop);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});
