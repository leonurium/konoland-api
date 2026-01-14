import { Controller, Get, Param, Query } from '@nestjs/common';
import { DistrictService } from './district.service';
import { GetDistrictsDTO } from '../../common/dto/get-districts.dto';

@Controller('district')
export class DistrictController {
  constructor(private readonly districtService: DistrictService) {}

  @Get()
  async getDistricts(@Query() getDistrictsQuery: GetDistrictsDTO) {
    return await this.districtService.getDistricts(getDistrictsQuery);
  }

  @Get(':code')
  async getDistrict(@Param('code') districtCode: string) {
    return await this.districtService.getDistrict(districtCode);
  }
}

