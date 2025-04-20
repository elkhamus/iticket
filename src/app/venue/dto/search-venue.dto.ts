import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Length, Max, Min } from 'class-validator';

export class FindVenueDto {
  @Type()
  @ApiProperty({default: '', required: false})
  @IsString()
  @Length(3, 30)
  name: string;
  
  @Type()
  @IsOptional()
  @ApiProperty({default: 5, required: false})
  @IsNumber()
  @Max(50)
  limit: number;
  
  @Type()
  @IsOptional()
  @ApiProperty({default: 0, required: false})
  @IsNumber()
  @Min(0)
  page: number;
}