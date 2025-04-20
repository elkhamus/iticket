import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SliderController } from "./slider.controller";
import { SliderService } from "./slider.service";

@Module({
    imports: [TypeOrmModule.forFeature([Event])],
    controllers: [SliderController],
    providers: [SliderService],
    exports: [SliderService]
})

export class SliderModule { }