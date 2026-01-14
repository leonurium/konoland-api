import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { District } from '../../entities/district.entity';
import { GetDistrictsDTO } from '../../common/dto/get-districts.dto';

@Injectable()
export class DistrictService {
  constructor(
    @InjectRepository(District)
    private readonly districtRepository: Repository<District>,
  ) {}

  async getDistricts(getDistrictsQuery: GetDistrictsDTO) {
    const { limit = 10, page = 1, name, code, regencyCode, kabkotCode, sortBy, sortDirection = 'ASC' } = getDistrictsQuery;

    // If code is provided, return the entity directly (backward compatibility)
    if (code) {
      return await this.districtRepository.findOne({
        where: { code },
        relations: ['regency'],
      });
    }

    const where: any = {};
    if (name) {
      where.district = Like(`%${name}%`);
    }
    // Support both regencyCode and legacy kabkotCode alias
    const effectiveRegencyCode = regencyCode || kabkotCode;
    if (effectiveRegencyCode) {
      where.regencyCode = effectiveRegencyCode;
    }

    // Define allowed sort fields to prevent SQL injection
    const allowedSortFields = ['code', 'district', 'regencyCode'];
    const orderField = sortBy && allowedSortFields.includes(sortBy) ? sortBy : 'code';
    const orderDirection = sortDirection.toUpperCase() as 'ASC' | 'DESC';

    const [districts, total] = await this.districtRepository.findAndCount({
      where,
      relations: ['regency'],
      take: limit,
      skip: (page - 1) * limit,
      order: { [orderField]: orderDirection },
    });

    return {
      data: districts,
      meta: {
        limit,
        page,
        total,
      },
    };
  }

  async getDistrict(districtCode: string) {
    const district = await this.districtRepository.findOne({
      where: { code: districtCode },
      relations: ['regency'],
    });

    if (!district) {
      throw new HttpException('district not found', HttpStatus.NOT_FOUND);
    }

    return district;
  }
}

