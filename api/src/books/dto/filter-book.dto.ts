import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class FilterBookDto {
  @IsOptional()
  @Transform(({ value }) => {
    if (value === '' || value === null || value === undefined) return undefined;
    return value.trim();
  })
  @IsString({ message: 'Author name must be a string' })
  authorName?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === '' || value === null || value === undefined) return undefined;
    return value.trim();
  })
  @IsString({ message: 'Title must be a string' })
  title?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === '' || value === null || value === undefined) return undefined;
    const num = Number(value);
    return isNaN(num) ? undefined : num;
  })
  @IsNumber({}, { message: 'Published year must be a number' })
  @Min(1000, { message: 'Published year must be a valid year' })
  publishedYear?: number;
}
