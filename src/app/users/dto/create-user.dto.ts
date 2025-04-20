import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsString,
  Length,
  Matches,
  MaxDate,
} from 'class-validator';
import * as dateFns from 'date-fns';
import { UserGender, UserRole } from 'src/shared/enum/user.enum';

export class CreateUserDto {
  @Type()
  @IsString()
  @Length(3, 30)
  @ApiProperty()
  firstName: string;

  @Type() 
  @IsString()
  @Length(3, 30)
  @ApiProperty()
  lastName: string;

  @Type()
  @IsString()
  @Length(13, 13)
  @ApiProperty({example: '0xx-xxx-xx-xx'})
  @Matches(/[0][0-9][0-9][-][0-9][0-9][0-9][-][0-9][0-9][-][0-9][0-9]/g, {
    message: 'not a valid format for a number',
  })
  number: string;

  @Type()
  @IsEmail()
  @ApiProperty()
  email: string;

  @Type()
  @IsString()
  @Length(3, 150)
  @ApiProperty()
  password: string;

  @Type()
  @IsDate()
  @MaxDate(() => dateFns.add(new Date(), { years: -10 }), {
    message: 'You are too young',
  })
  @ApiProperty()
  birthDate: Date;

  @Type()
  @IsEnum(UserGender)
  @ApiProperty({ enum: UserGender })
  gender: UserGender;

  @Type()
  @IsEnum(UserRole, { each: true })
  @ApiProperty({ default: [UserRole.USER] })
  roles: UserRole[];
}
