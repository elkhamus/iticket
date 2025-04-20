import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindParams } from "src/shared/types/find.params";
import { Repository } from "typeorm";
import { SLIDER_BASIC_SELECT } from "./slider.select";
import { Event } from "src/database/entities/Event.entity";

@Injectable()
export class SliderService {

    constructor(
        @InjectRepository(Event)
        private eventRepo: Repository<Event>,
    ) {}

    findOne(params: Omit<FindParams<Event>, 'limit' | 'page'>) {
        const { where, relations, select } = params;
        return this.eventRepo.findOne({ where, relations, select });
      }

    async getSlider(id: number)
    {
        return await this.findOne({ 
            where: {id: id},
            relations: ['image'],  
            select: SLIDER_BASIC_SELECT 
        });
    }

}