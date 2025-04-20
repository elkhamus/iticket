import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TicketEntity } from "src/database/entities/Ticket.entity";
import { TicketController } from "./ticket.controller";
import { TicketService } from "./ticket.service";
import { EventsModule } from "../events/events.module";

@Module({
    imports: [TypeOrmModule.forFeature([TicketEntity]), EventsModule],
    controllers: [TicketController],
    providers: [TicketService],
    exports: [TicketService]
})

export class TicketModule{}