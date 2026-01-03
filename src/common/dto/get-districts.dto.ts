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
}

