import { DataSource } from 'typeorm';

const dataSourceConfig: any = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  entities: ['dist/entities/**/*.entity.js'],
  migrations: ['dist/migrations/**/*.js'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
};

// Add schema if specified in environment variable
if (process.env.DATABASE_SCHEMA) {
  dataSourceConfig.schema = process.env.DATABASE_SCHEMA;
}

export const AppDataSource = new DataSource(dataSourceConfig);

