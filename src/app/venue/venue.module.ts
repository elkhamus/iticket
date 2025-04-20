import { forwardRef, Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Venue } from "src/database/entities/Venue.entity";
import { VenueController } from "./venue.controller";
import { VenueService } from "./venue.service";
import { EventsModule } from "../events/events.module";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Venue]), forwardRef(() => EventsModule)],
  controllers: [VenueController],
  providers: [VenueService],
  exports: [VenueService],
})
export class VenueModule {}
