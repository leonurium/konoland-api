import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Province } from '../../entities/province.entity';
import { GetProvincesDTO } from '../../common/dto/get-provinces.dto';

@Injectable()
export class ProvinceService {
  constructor(
    @InjectRepository(Province)
    private readonly provinceRepository: Repository<Province>,
  ) {}

  async getProvinces(getProvincesQuery: GetProvincesDTO) {
    const { limit = 10, page = 1, name, code, sortBy, sortDirection = 'ASC' } = getProvincesQuery;

    // If code is provided, return the entity directly (backward compatibility)
    if (code) {
      return await this.provinceRepository.findOne({
        where: { code },
      });
    }

    const where: any = {};
    if (name) {
      where.province = Like(`%${name}%`);
    }

    // Define allowed sort fields to prevent SQL injection
    const allowedSortFields = ['code', 'province'];
    const orderField = sortBy && allowedSortFields.includes(sortBy) ? sortBy : 'code';
    const orderDirection = sortDirection.toUpperCase() as 'ASC' | 'DESC';

    const [provinces, total] = await this.provinceRepository.findAndCount({
      where,
      take: limit,
      skip: (page - 1) * limit,
      order: { [orderField]: orderDirection },
    });

    return {
      data: provinces,
      meta: {
        limit,
        page,
        total,
      },
    };
  }

  async getProvince(provinceCode: string) {
    const province = await this.provinceRepository.findOne({
      where: { code: provinceCode },
    });

    if (!province) {
      throw new HttpException('province not found', HttpStatus.NOT_FOUND);
    }

    return province;
  }
}

