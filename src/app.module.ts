import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProvinceModule } from './modules/province/province.module';
import { RegencyModule } from './modules/regency/regency.module';
import { DistrictModule } from './modules/district/district.module';
import { VillageModule } from './modules/village/village.module';
import { Province } from './entities/province.entity';
import { Regency } from './entities/regency.entity';
import { District } from './entities/district.entity';
import { Village } from './entities/village.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const config: any = {
          type: 'postgres',
          url: configService.get<string>('DATABASE_URL'),
          entities: [Province, Regency, District, Village],
          synchronize: false, // Use migrations in production
          ssl: configService.get<string>('NODE_ENV') === 'production' 
          ? { rejectUnauthorized: false } 
          : false,
          logging: configService.get<string>('NODE_ENV') === 'development',
        };

        // Add schema if specified in environment variable
        const schema = configService.get<string>('DATABASE_SCHEMA');
        if (schema) {
          config.schema = schema;
        }

        return config;
      },
      inject: [ConfigService],
    }),
    ProvinceModule,
    RegencyModule,
    DistrictModule,
    VillageModule,
  ],
})
export class AppModule {}

