import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBookTagDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The name of the book tag',
    example: 'Fiction',
  })
  name: string;
}
