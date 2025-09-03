import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateAuthorDto {
  @IsString()
  @ApiProperty({
    description: 'The name of the author',
    example: 'John Doe',
  })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The bio of the author',
    example: 'John Doe is a writer',
  })
  bio?: string;
}
