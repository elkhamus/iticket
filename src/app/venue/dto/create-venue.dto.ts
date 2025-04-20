import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, Length } from 'class-validator';

export class CreateVenueDto {
  @Type()
  @ApiProperty()
  @IsString()
  @Length(3, 30)
  name: string;
}