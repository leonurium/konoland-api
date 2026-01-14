import { IsOptional, IsString } from 'class-validator';
import { PaginationDTO } from './pagination.dto';

export class GetVillagesDTO extends PaginationDTO {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  districtCode?: string;

  // Legacy alias for backward compatibility with wilayah-nusantara
  @IsOptional()
  @IsString()
  kecamatanCode?: string;
}

