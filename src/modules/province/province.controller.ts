import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProvinceService } from './province.service';
import { GetProvincesDTO } from '../../common/dto/get-provinces.dto';

@Controller('province')
export class ProvinceController {
  constructor(private readonly provinceService: ProvinceService) {}

  @Get()
  async getProvinces(@Query() getProvincesQuery: GetProvincesDTO) {
    return await this.provinceService.getProvinces(getProvincesQuery);
  }

  @Get(':code')
  async getProvince(@Param('code') provinceCode: string) {
    return await this.provinceService.getProvince(provinceCode);
  }
}

