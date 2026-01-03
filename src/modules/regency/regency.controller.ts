import { Controller, Get, Param, Query } from '@nestjs/common';
import { RegencyService } from './regency.service';
import { GetRegenciesDTO } from '../../common/dto/get-regencies.dto';
import { generateResponse } from '../../common/helpers/response.helper';

@Controller('regency')
export class RegencyController {
  constructor(private readonly regencyService: RegencyService) {}

  @Get()
  async getRegencies(@Query() getRegenciesQuery: GetRegenciesDTO) {
    const result = await this.regencyService.getRegencies(getRegenciesQuery);
    
    // Backward compatibility: if code was provided, result is entity directly
    if (getRegenciesQuery.code) {
      return generateResponse('Success', { regency: result }, 200);
    }
    
    return generateResponse('Success', { regencies_paginated: result }, 200);
  }

  @Get(':code')
  async getRegency(@Param('code') regencyCode: string) {
    const regency = await this.regencyService.getRegency(regencyCode);
    return generateResponse('Success', { regency }, 200);
  }
}

