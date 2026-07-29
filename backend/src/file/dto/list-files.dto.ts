import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
} from '../file.constants';

export class ListFilesDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = DEFAULT_PAGE;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_PAGE_SIZE)
  limit: number = DEFAULT_PAGE_SIZE;

  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  search?: string;

  @IsOptional()
  @Transform(({ value }: { value: unknown }) => toArray(value))
  @IsArray()
  @IsIn(
    ['image', 'pdf', 'spreadsheet', 'presentation', 'archive', 'text', 'other'],
    { each: true },
  )
  types?: FileCategory[];

  @IsOptional()
  @Transform(({ value }: { value: unknown }) => toArray(value).map(Number))
  @IsArray()
  @IsInt({ each: true })
  tagIds?: number[];
}

export const FILE_CATEGORIES = [
  'image',
  'pdf',
  'spreadsheet',
  'presentation',
  'archive',
  'text',
  'other',
] as const;
export type FileCategory = (typeof FILE_CATEGORIES)[number];

function toArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.flatMap((item) => toArray(item));
  if (typeof value !== 'string') return [];
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}
