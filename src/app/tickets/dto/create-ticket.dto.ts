import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, Min } from "class-validator";

export class CreateTicketDto {

    @Type()
    @ApiProperty()
    @IsNumber()
    price: number;

    @Type()
    @ApiProperty()
    @IsNumber()
    eventId: number;

    @Type()
    @ApiProperty()
    @IsNumber()
    @Min(1)
    seat: number;

}