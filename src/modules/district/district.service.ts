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
    const { limit = 10, page = 1, name, code, regencyCode } = getDistrictsQuery;

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
    if (regencyCode) {
      where.regencyCode = regencyCode;
    }

    const [districts, total] = await this.districtRepository.findAndCount({
      where,
      relations: ['regency'],
      take: limit,
      skip: (page - 1) * limit,
      order: { code: 'ASC' },
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

