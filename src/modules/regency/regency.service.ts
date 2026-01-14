import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Regency } from '../../entities/regency.entity';
import { GetRegenciesDTO } from '../../common/dto/get-regencies.dto';

@Injectable()
export class RegencyService {
  constructor(
    @InjectRepository(Regency)
    private readonly regencyRepository: Repository<Regency>,
  ) {}

  async getRegencies(getRegenciesQuery: GetRegenciesDTO) {
    const { limit = 10, page = 1, name, code, provinceCode, provinsiCode, sortBy, sortDirection = 'ASC' } = getRegenciesQuery;

    // If code is provided, return the entity directly (backward compatibility)
    if (code) {
      return await this.regencyRepository.findOne({
        where: { code },
        relations: ['province'],
      });
    }

    const where: any = {};
    if (name) {
      where.regency = Like(`%${name}%`);
    }
    // Support both provinceCode and legacy provinsiCode alias
    const effectiveProvinceCode = provinceCode || provinsiCode;
    if (effectiveProvinceCode) {
      where.provinceCode = effectiveProvinceCode;
    }

    // Define allowed sort fields to prevent SQL injection
    const allowedSortFields = ['code', 'regency', 'provinceCode', 'type'];
    const orderField = sortBy && allowedSortFields.includes(sortBy) ? sortBy : 'code';
    const orderDirection = sortDirection.toUpperCase() as 'ASC' | 'DESC';

    const [regencies, total] = await this.regencyRepository.findAndCount({
      where,
      relations: ['province'],
      take: limit,
      skip: (page - 1) * limit,
      order: { [orderField]: orderDirection },
    });

    return {
      data: regencies,
      meta: {
        limit,
        page,
        total,
      },
    };
  }

  async getRegency(regencyCode: string) {
    const regency = await this.regencyRepository.findOne({
      where: { code: regencyCode },
      relations: ['province'],
    });

    if (!regency) {
      throw new HttpException('regency not found', HttpStatus.NOT_FOUND);
    }

    return regency;
  }
}

