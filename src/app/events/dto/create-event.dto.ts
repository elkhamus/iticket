import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsNumber, IsOptional, IsString, Length, Min } from "class-validator";

export class CreateEventDto {
    
    @Type()
    @ApiProperty()
    @IsString()
    name: string;
    
    @Type()
    @ApiProperty()
    @IsString()
    @Length(20, 200)
    description: string;
    
    @Type()
    @ApiProperty()
    @IsString()
    @Length(3)
    language: string;

    @Type()
    @ApiProperty()
    @IsNumber()
    @Min(3)
    ageReq: number;

    @Type()
    @IsNumber()
    @ApiProperty()
    venue: number;

    @Type()
    @ApiProperty()
    @IsDate()
    date: Date;

    @Type()
    @IsNumber()
    @ApiProperty()
    imageId: number;

    @Type()
    @ApiProperty()
    @IsNumber({}, {each: true})
    categories: number[];
}