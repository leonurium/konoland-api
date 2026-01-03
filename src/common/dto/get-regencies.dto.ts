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
}

