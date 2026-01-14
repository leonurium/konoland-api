import { IsOptional, IsString } from 'class-validator';
import { PaginationDTO } from './pagination.dto';

export class GetDistrictsDTO extends PaginationDTO {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  regencyCode?: string;

  // Legacy alias for backward compatibility with wilayah-nusantara
  @IsOptional()
  @IsString()
  kabkotCode?: string;
}

