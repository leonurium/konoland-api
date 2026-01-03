import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Village } from '../../entities/village.entity';
import { VillageController } from './village.controller';
import { VillageService } from './village.service';

@Module({
  imports: [TypeOrmModule.forFeature([Village])],
  controllers: [VillageController],
  providers: [VillageService],
  exports: [VillageService],
})
export class VillageModule {}

