import { Transform } from 'class-transformer';
import { ArrayUnique, IsArray, IsInt, IsOptional } from 'class-validator';

function parseTagIds(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(Number);
  if (typeof value !== 'string') return value;
  if (value.trim() === '') return [];

  try {
    const parsed: unknown = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.map(Number);
  } catch {
    return value.split(',').map((id) => Number(id.trim()));
  }

  return value;
}

export class UploadFileDto {
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => parseTagIds(value))
  @IsArray({ message: 'tagIds must be an array' })
  @ArrayUnique({ message: 'tagIds must not contain duplicates' })
  @IsInt({ each: true, message: 'Each tag ID must be an integer' })
  tagIds: number[] = [];
}
