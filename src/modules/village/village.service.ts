import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Village } from '../../entities/village.entity';
import { GetVillagesDTO } from '../../common/dto/get-villages.dto';

@Injectable()
export class VillageService {
  constructor(
    @InjectRepository(Village)
    private readonly villageRepository: Repository<Village>,
  ) {}

  async getVillages(getVillagesQuery: GetVillagesDTO) {
    const { limit = 10, page = 1, name, code, districtCode, sortBy, sortDirection = 'ASC' } = getVillagesQuery;

    // If code is provided, return the entity directly (backward compatibility)
    if (code) {
      return await this.villageRepository.findOne({
        where: { code },
        relations: ['district'],
      });
    }

    const where: any = {};
    if (name) {
      where.village = Like(`%${name}%`);
    }
    if (districtCode) {
      where.districtCode = districtCode;
    }

    // Define allowed sort fields to prevent SQL injection
    const allowedSortFields = ['code', 'village', 'districtCode', 'postalCode'];
    const orderField = sortBy && allowedSortFields.includes(sortBy) ? sortBy : 'code';
    const orderDirection = sortDirection.toUpperCase() as 'ASC' | 'DESC';

    const [villages, total] = await this.villageRepository.findAndCount({
      where,
      relations: ['district'],
      take: limit,
      skip: (page - 1) * limit,
      order: { [orderField]: orderDirection },
    });

    return {
      data: villages,
      meta: {
        limit,
        page,
        total,
      },
    };
  }

  async getVillage(villageCode: string) {
    const village = await this.villageRepository.findOne({
      where: { code: villageCode },
      relations: ['district'],
    });

    if (!village) {
      throw new HttpException('village not found', HttpStatus.NOT_FOUND);
    }

    return village;
  }
}

