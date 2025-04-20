import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EventsController } from "./events.controller";
import { EventsService } from "./events.service";
import { CategoryModule } from "../categories/category.module";
import { Event } from "src/database/entities/Event.entity";
import { VenueModule } from "../venue/venue.module";

@Module({
    imports: [TypeOrmModule.forFeature([Event]), CategoryModule, forwardRef(() => VenueModule)],
    controllers: [EventsController],
    providers: [EventsService],
    exports: [EventsService]
})
export class EventsModule {}