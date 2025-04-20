import { TicketEntity } from "src/database/entities/Ticket.entity";
import { FindOptionsSelect } from "typeorm";

export const BASIC_TICKET_SELECT : FindOptionsSelect<TicketEntity> = {

    id: true,
    seat: true,
    price: true,
    eventId: {
        name: true,
        date: true,
        ageReq: true,
        venue: {
            name: true,
        },
        categories: {
            name: true
        }
    }
}