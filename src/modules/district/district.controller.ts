import { Controller, Get, Param, Query } from '@nestjs/common';
import { DistrictService } from './district.service';
import { GetDistrictsDTO } from '../../common/dto/get-districts.dto';
import { generateResponse } from '../../common/helpers/response.helper';

@Controller('district')
export class DistrictController {
  constructor(private readonly districtService: DistrictService) {}

  @Get()
  async getDistricts(@Query() getDistrictsQuery: GetDistrictsDTO) {
    const result = await this.districtService.getDistricts(getDistrictsQuery);
    
    // Backward compatibility: if code was provided, result is entity directly
    if (getDistrictsQuery.code) {
      return generateResponse('Success', { district: result }, 200);
    }
    
    return generateResponse('Success', { districts_paginated: result }, 200);
  }

  @Get(':code')
  async getDistrict(@Param('code') districtCode: string) {
    const district = await this.districtService.getDistrict(districtCode);
    return generateResponse('Success', { district }, 200);
  }
}

