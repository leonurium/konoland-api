import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Province } from '../../entities/province.entity';
import { Regency } from '../../entities/regency.entity';
import { District } from '../../entities/district.entity';
import { Village } from '../../entities/village.entity';

export type SearchResultType = 'province' | 'regency' | 'district' | 'village';

export interface SearchResultItem {
  type: SearchResultType;
  item: Province | Regency | District | Village;
}

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Province)
    private readonly provinceRepository: Repository<Province>,
    @InjectRepository(Regency)
    private readonly regencyRepository: Repository<Regency>,
    @InjectRepository(District)
    private readonly districtRepository: Repository<District>,
    @InjectRepository(Village)
    private readonly villageRepository: Repository<Village>,
  ) {}

  async search(q: string): Promise<{ data: SearchResultItem[] }> {
    const query = q?.trim();
    if (!query) {
      throw new HttpException('q is required', HttpStatus.BAD_REQUEST);
    }

    const take = 10;

    const [provinces, regencies, districts, villages] = await Promise.all([
      this.provinceRepository.find({
        where: { province: ILike(`%${query}%`) },
        take,
        order: { code: 'ASC' },
      }),
      this.regencyRepository.find({
        where: { regency: ILike(`%${query}%`) },
        relations: ['province'],
        take,
        order: { code: 'ASC' },
      }),
      this.districtRepository.find({
        where: { district: ILike(`%${query}%`) },
        relations: ['regency', 'regency.province'],
        take,
        order: { code: 'ASC' },
      }),
      this.villageRepository.find({
        where: { village: ILike(`%${query}%`) },
        relations: ['district', 'district.regency', 'district.regency.province'],
        take,
        order: { code: 'ASC' },
      }),
    ]);

    const data: SearchResultItem[] = [
      ...provinces.map((item) => ({ type: 'province' as const, item })),
      ...regencies.map((item) => ({ type: 'regency' as const, item })),
      ...districts.map((item) => ({ type: 'district' as const, item })),
      ...villages.map((item) => ({ type: 'village' as const, item })),
    ];

    return { data };
  }
}

