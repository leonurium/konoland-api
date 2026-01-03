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
    const { limit = 10, page = 1, name, code, provinceCode } = getRegenciesQuery;

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
    if (provinceCode) {
      where.provinceCode = provinceCode;
    }

    const [regencies, total] = await this.regencyRepository.findAndCount({
      where,
      relations: ['province'],
      take: limit,
      skip: (page - 1) * limit,
      order: { code: 'ASC' },
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

