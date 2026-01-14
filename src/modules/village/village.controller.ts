import { Controller, Get, Param, Query } from '@nestjs/common';
import { VillageService } from './village.service';
import { GetVillagesDTO } from '../../common/dto/get-villages.dto';

@Controller('village')
export class VillageController {
  constructor(private readonly villageService: VillageService) {}

  @Get()
  async getVillages(@Query() getVillagesQuery: GetVillagesDTO) {
    return await this.villageService.getVillages(getVillagesQuery);
  }

  @Get(':code')
  async getVillage(@Param('code') villageCode: string) {
    return await this.villageService.getVillage(villageCode);
  }
}

