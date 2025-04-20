import { Venue } from "src/database/entities/Venue.entity";
import { FindOptionsSelect } from "typeorm";

export const VENUE_BASIC_SELECT : FindOptionsSelect<Venue> = {
    id: true,
    name: true
};