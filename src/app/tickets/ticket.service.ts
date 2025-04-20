import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TicketEntity } from "src/database/entities/Ticket.entity";
import { FindParams } from "src/shared/types/find.params";
import { FindManyOptions, Repository } from "typeorm";
import { CreateTicketDto } from "./dto/create-ticket.dto";
import { EventsService } from "../events/events.service";
import { BASIC_TICKET_SELECT } from "./ticket.select";
import { TicketStatus } from "src/shared/enum/ticket.enum";

@Injectable()
export class TicketService  {
    
    constructor(

        private eventService: EventsService,

        @InjectRepository(TicketEntity)
        private ticketRepo: Repository<TicketEntity>

    )   {} 


    findOne(params: Omit<FindParams<TicketEntity>, 'limit' | 'page'>) {
        const { where, relations, select } = params;
        return this.ticketRepo.findOne({ where, relations, select: BASIC_TICKET_SELECT });
}

    findAll(params: FindParams<TicketEntity>){
    const {where, select, relations, limit, page} = params;
    const payload:FindManyOptions<TicketEntity> = {where, select, relations}

    if(limit>0) {
      payload.take = limit;
      payload.skip = limit* page
    }

    return this.ticketRepo.find(payload)
  }
    async create(params: CreateTicketDto) {
    let checkTicketEvent = await this.eventService.findOne({ where: { id: params.eventId } });
    if (!checkTicketEvent)
      throw new ConflictException('This event does not exists');
    
    const ifTaken = await this.eventService.takenSeat(params);
    if (ifTaken)
     throw new ConflictException('This ticket is already bought');

    let ticket = await this.ticketRepo.create({
          ...params,
          status: TicketStatus.PENDING,
          eventId: { id: params.eventId },
        });
        await ticket.save();
        return {
          status: true,
          ticket,
        };
  }

    async acceptTicket(id: number)
  {
        let ticket = await this.ticketRepo.findOne({where: { id }})
        if (!ticket) throw new NotFoundException();

        if(ticket.status === TicketStatus.PENDING){
            ticket.status = TicketStatus.ACCEPTED;
        }
        else
        {
            throw new ConflictException('Ticket has been accepted or rejected')
        }
        
        await ticket.save();
        return {
          status: true,
          ticket
        };
  }

    async rejectTicket(id: number)
  {
        let ticket = await this.ticketRepo.findOne({where: { id }})
        if (!ticket) throw new NotFoundException();

        if(ticket.status === TicketStatus.PENDING){
            ticket.status = TicketStatus.REJECTED;
            ticket.price = -ticket.price;
        }
        else
        {
            throw new ConflictException('Ticket has been accepted or rejected')
        }
        
        await ticket.save();
        return {
          status: true,
          ticket,
          message: 'Ticket refunded successfully'
        };
  }

  async delete(id: number) {
    let event = await this.ticketRepo.findOne({where: { id }})
    if (!event) throw new NotFoundException();
    
    let result = await this.ticketRepo.delete({ id });
    if (result.affected === 0) throw new InternalServerErrorException();

    await this.ticketRepo.delete({ id });
    
    return {
      message: 'Ticket refunded successfully',
    };
  }

}