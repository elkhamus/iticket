import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsNumber, IsString, IsUrl, Length, Matches } from "class-validator";

export class UpdateSettingsDto {
    
    @Type()
    @IsString()
    @ApiProperty()
    @Length(3, 15)
    siteName: string

    @Type()
    @IsString()
    @ApiProperty()
    @Length(15, 150)
    siteDescription: string

    @Type()
    @IsString()
    @Length(13, 13)
    @ApiProperty({example: '0xx-xxx-xx-xx'})
    @Matches(/[0][0-9][0-9][-][0-9][0-9][0-9][-][0-9][0-9][-][0-9][0-9]/g, {
      message: 'not a valid format for a number',
    })
    number: string;

    @Type()
    @IsUrl()
    @ApiProperty()
    icon: string;

}