import { Event } from "src/database/entities/Event.entity";
import { FindOptionsSelect } from "typeorm";

export const EVENT_BASIC_SELECT : FindOptionsSelect<Event> = {
    id: true,
    name: true,
    description: true,
    date: true,
    ageReq: true,
    venue: {
        name:true
    },
    imageId: {
        url: true
    },
    categories: {
        name: true
    }
};