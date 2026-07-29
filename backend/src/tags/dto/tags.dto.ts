import { IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
export enum OrderByWeight {
  ASC = 'asc',
  DESC = 'desc',
}
export class TagsQueryDTO {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number = 10;
}
