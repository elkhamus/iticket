import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { TicketService } from "./ticket.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGard } from "src/guards/auth.guard";
import { UserRole } from "src/shared/enum/user.enum";
import { Roles } from "src/shared/decorators/roles.decorator";
import { CreateTicketDto } from "./dto/create-ticket.dto";

@Controller('ticket')
@ApiTags('Ticket')
export class TicketController {
    constructor(
        private ticketService: TicketService
    ) {}

    @Get(':id')
    @ApiBearerAuth()
    @UseGuards(AuthGard)
    @Roles(UserRole.ADMIN)
    find(@Param('id') id: number) {
        let ticket = this.ticketService.findOne({ where: { id }, relations: ['eventId'] });
        if (!ticket) return {status: 404, message: "This ticket doesnt exist"};
        return ticket;
    }
  
    @Delete(':id')
    @ApiBearerAuth()
    @UseGuards(AuthGard)
    @Roles(UserRole.ADMIN)
    async delete(@Param('id') id: number) {
     return await this.ticketService.delete(id);
    }

    @Post()
    @ApiBearerAuth()
    @UseGuards(AuthGard)
    async create(@Body() body: CreateTicketDto) {
     return await this.ticketService.create(body);
    }

    @Post(':id')
    @ApiBearerAuth()
    @UseGuards(AuthGard)
    @Roles(UserRole.ADMIN)
    async acceptTicket(@Param('id') id: number) {
     return await this.ticketService.acceptTicket(id);
    }

    @Post(':id')
    @ApiBearerAuth()
    @UseGuards(AuthGard)
    @Roles(UserRole.ADMIN)
    async rejectTicket(@Param('id') id: number) {
     return await this.ticketService.rejectTicket(id);
    }
}