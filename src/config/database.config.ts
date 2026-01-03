import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  entities: ['dist/entities/**/*.entity.js'],
  migrations: ['dist/migrations/**/*.js'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
});

