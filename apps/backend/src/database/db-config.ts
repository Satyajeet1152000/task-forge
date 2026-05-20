import { env } from "@task-forge/shared/env";
import { Pool } from "pg";

export default class DatabaseConfig {
  public static DB_POOL: Pool;
  static {
    this.createDBPool();
  }

  public static getDBConnection(): Pool {
    if (DatabaseConfig.DB_POOL) {
      return DatabaseConfig.DB_POOL;
    }
    DatabaseConfig.DB_POOL = DatabaseConfig.createDBPool();
    return DatabaseConfig.DB_POOL;
  }

  private static createDBPool(): Pool {
    const dbPool: Pool = new Pool({
      application_name: env.APP_NAME,
      host: env.DATABASE_HOST,
      port: env.DATABASE_PORT,
      user: env.DATABASE_USERNAME,
      password: env.DATABASE_PASSWORD,
      database: env.DATABASE_NAME,
      ssl: {
        rejectUnauthorized: false,
      },
    });

    dbPool.on("error", (err) => {
      console.error("Unexpected error on postgres DB client", err);
    });
    return dbPool;
  }
}
