import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProvinceService } from './province.service';
import { GetProvincesDTO } from '../../common/dto/get-provinces.dto';
import { generateResponse } from '../../common/helpers/response.helper';

@Controller('province')
export class ProvinceController {
  constructor(private readonly provinceService: ProvinceService) {}

  @Get()
  async getProvinces(@Query() getProvincesQuery: GetProvincesDTO) {
    const result = await this.provinceService.getProvinces(getProvincesQuery);
    
    // Backward compatibility: if code was provided, result is entity directly
    // Otherwise, result is pagination object
    if (getProvincesQuery.code) {
      return generateResponse('Success', { province: result }, 200);
    }
    
    return generateResponse('Success', { provinces_paginated: result }, 200);
  }

  @Get(':code')
  async getProvince(@Param('code') provinceCode: string) {
    const province = await this.provinceService.getProvince(provinceCode);
    return generateResponse('Success', { province }, 200);
  }
}

