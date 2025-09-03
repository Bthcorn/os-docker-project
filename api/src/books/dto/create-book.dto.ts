import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @ApiProperty({
    description: 'The title of the book',
    example: 'The Great Gatsby',
  })
  title: string;

  @IsString()
  @ApiProperty({
    description: 'The ISBN of the book',
    example: '978-0-00-000000-0',
  })
  isbn: string;

  @IsInt()
  @IsOptional()
  @ApiProperty({
    description: 'The published year of the book',
    example: 2020,
  })
  publishedYear: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The summary of the book',
    example: 'The Great Gatsby is a novel by F. Scott Fitzgerald.',
  })
  summary: string;

  @IsInt()
  @ApiProperty({
    description: 'The author ID of the book',
    example: 1,
  })
  authorId: number;

  @IsArray()
  @IsOptional()
  @ApiProperty({
    description: 'The tags of the book',
    example: [1],
  })
  tags: number[];
}
