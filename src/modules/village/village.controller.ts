import { Controller, Get, Param, Query } from '@nestjs/common';
import { VillageService } from './village.service';
import { GetVillagesDTO } from '../../common/dto/get-villages.dto';
import { generateResponse } from '../../common/helpers/response.helper';

@Controller('village')
export class VillageController {
  constructor(private readonly villageService: VillageService) {}

  @Get()
  async getVillages(@Query() getVillagesQuery: GetVillagesDTO) {
    const result = await this.villageService.getVillages(getVillagesQuery);
    
    // Backward compatibility: if code was provided, result is entity directly
    if (getVillagesQuery.code) {
      return generateResponse('Success', { village: result }, 200);
    }
    
    return generateResponse('Success', { villages_paginated: result }, 200);
  }

  @Get(':code')
  async getVillage(@Param('code') villageCode: string) {
    const village = await this.villageService.getVillage(villageCode);
    return generateResponse('Success', { village }, 200);
  }
}

