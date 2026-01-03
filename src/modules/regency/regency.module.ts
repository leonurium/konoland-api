import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Regency } from '../../entities/regency.entity';
import { RegencyController } from './regency.controller';
import { RegencyService } from './regency.service';

@Module({
  imports: [TypeOrmModule.forFeature([Regency])],
  controllers: [RegencyController],
  providers: [RegencyService],
  exports: [RegencyService],
})
export class RegencyModule {}

