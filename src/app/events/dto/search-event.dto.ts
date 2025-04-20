import { ApiProperty } from "@nestjs/swagger"
import { Transform, Type } from "class-transformer"
import { IsNumber, IsOptional, IsString, Max, Min } from "class-validator"

export class GetEventDto {
    @Type()
    @IsOptional()
    @ApiProperty({default: '', required: false})
    @IsString()
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