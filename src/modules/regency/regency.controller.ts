import { Controller, Get, Param, Query } from '@nestjs/common';
import { RegencyService } from './regency.service';
import { GetRegenciesDTO } from '../../common/dto/get-regencies.dto';

@Controller('regency')
export class RegencyController {
  constructor(private readonly regencyService: RegencyService) {}

  @Get()
  async getRegencies(@Query() getRegenciesQuery: GetRegenciesDTO) {
    return await this.regencyService.getRegencies(getRegenciesQuery);
  }

  @Get(':code')
  async getRegency(@Param('code') regencyCode: string) {
    return await this.regencyService.getRegency(regencyCode);
  }
}

