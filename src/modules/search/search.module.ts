import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Province } from '../../entities/province.entity';
import { Regency } from '../../entities/regency.entity';
import { District } from '../../entities/district.entity';
import { Village } from '../../entities/village.entity';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  imports: [TypeOrmModule.forFeature([Province, Regency, District, Village])],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}

