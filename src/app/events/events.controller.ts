import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { EventsService } from "./events.service";
import { GetEventDto } from "./dto/search-event.dto";
import { AuthGard } from "src/guards/auth.guard";
import { Roles } from "src/shared/decorators/roles.decorator";
import { UserRole } from "src/shared/enum/user.enum";
import { CreateEventDto } from "./dto/create-event.dto";
import { UpdateEventDto } from "./dto/update-event.dto";

@Controller('events')
@ApiTags('Events')
@ApiBearerAuth()
export class EventsController {

    constructor(

        private eventService: EventsService

    ) {}

  @Get('search')
  @ApiBearerAuth()
  @UseGuards(AuthGard)
  search(@Query() query: GetEventDto) {
    return this.eventService.searchByName(query);

}

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGard)
  find(@Param('id') id: number) {
    let event = this.eventService.findOne({ where: { id }, relations: ['categories'] });
    if (!event) return {status: 404, message: "This event doesnt exist"};
     return event
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGard)
  @Roles(UserRole.ADMIN)
  async create(@Body() body: CreateEventDto) {
   return await this.eventService.create(body);
  }

  @Post(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGard)
  @Roles(UserRole.ADMIN)
   async update(@Param('id') id: number, @Body() body: UpdateEventDto) {
    return await this.eventService.update(id, body);
   }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGard)
  @Roles(UserRole.ADMIN)
  async delete(@Param('id') id: number) {
   return await this.eventService.delete(id);
  }

}