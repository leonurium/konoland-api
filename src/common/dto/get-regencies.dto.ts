import { IsOptional, IsString } from 'class-validator';
import { PaginationDTO } from './pagination.dto';

export class GetRegenciesDTO extends PaginationDTO {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  provinceCode?: string;

  // Legacy alias for backward compatibility with wilayah-nusantara
  @IsOptional()
  @IsString()
  provinsiCode?: string;
}

