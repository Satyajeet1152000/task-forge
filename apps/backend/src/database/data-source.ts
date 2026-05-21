import { env } from "@task-forge/shared/env";
import { DataSource, DataSourceOptions } from "typeorm";

const baseConfig: DataSourceOptions = {
  type: "postgres",
  host: env.DATABASE_HOST,
  port: env.DATABASE_PORT,
  username: env.DATABASE_USERNAME,
  password: env.DATABASE_PASSWORD,
  database: env.DATABASE_NAME,
  synchronize: false,
};

const { NODE_ENV } = process.env;

const AppDataSource = ((): DataSource => {
  if (NODE_ENV !== "production") {
    return new DataSource({
      ...baseConfig,
      logging: false,
      entities: ["src/modules/**/*.entity{.ts,.js}"],
      migrations: ["src/database/migrations/*{.ts,.js}"],
      subscribers: [],
    });
  }

  return new DataSource({
    ...baseConfig,
    ssl: {
      rejectUnauthorized: false,
    },
    logging: false,
    entities: ["dist/modules/**/*.entity{.ts,.js}"],
    migrations: ["dist/database/migrations/*{.ts,.js}"],
    subscribers: [],
  });
})();

export default AppDataSource;
