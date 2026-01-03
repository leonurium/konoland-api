import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Province } from '../../entities/province.entity';
import { ProvinceController } from './province.controller';
import { ProvinceService } from './province.service';

@Module({
  imports: [TypeOrmModule.forFeature([Province])],
  controllers: [ProvinceController],
  providers: [ProvinceService],
  exports: [ProvinceService],
})
export class ProvinceModule {}

