import { Event } from "src/database/entities/Event.entity";
import { FindOptionsSelect } from "typeorm";

export const SLIDER_BASIC_SELECT : FindOptionsSelect<Event> = {
    name: true,
    description: true,
    imageId: {
        url: true
    }
};