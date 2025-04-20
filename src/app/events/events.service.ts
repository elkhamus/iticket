import { ConflictException, forwardRef, Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { FindManyOptions, FindOptionsWhere, ILike, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { FindParams } from "src/shared/types/find.params";
import { CreateEventDto } from "./dto/create-event.dto";
import { UpdateEventDto } from "./dto/update-event.dto";
import { CategoryService } from "../categories/category.service";
import { GetEventDto } from "./dto/search-event.dto";
import { EVENT_BASIC_SELECT } from "./events.select";
import { Event } from "./../../database/entities/Event.entity";
import { VenueService } from "../venue/venue.service";
import { CreateTicketDto } from "../tickets/dto/create-ticket.dto";

@Injectable()
export class EventsService {

    constructor(
      @Inject(forwardRef(() => VenueService))
        private venueService: VenueService,
        private categoryService: CategoryService,
        @InjectRepository(Event)
        private eventRepo: Repository<Event>

    ) {}

      findAll(params: FindParams<Event>){
        const {where, select, relations, limit, page} = params;
        const payload:FindManyOptions<Event> = {where, select, relations}
    
        if(limit>0) {
          payload.take = limit;
          payload.skip = limit* page
        }

        return this.eventRepo.find(payload)
      }

      findOne(params: Omit<FindParams<Event>, 'limit' | 'page'>) {
        const { where, relations, select } = params;
        return this.eventRepo.findOne({ where, relations, select });
      }
      
      async create(params: CreateEventDto) {
        let checkEventName = await this.findOne({ where: { name: params.name.toUpperCase() } });
        if (checkEventName)
          throw new ConflictException('This event name already exists');
    
        let checkLocation = await this.findOne({ where: { venue: { id: params.venue } } });
        
       const existingEvent = await this.venueService.existingEvent(params);
       if (checkLocation)
         throw new ConflictException('This venue does not exists');
          
        if (existingEvent)
          throw new ConflictException('There is an event at this time in this venue');

        const categories = params.categories.map((id) => ({ id }));
        let event = await this.eventRepo.create({
              ...params,
              venue: { id: params.venue },
              imageId: { id: params.imageId },
              categories
            });
            await event.save();
            return {
              status: true,
              event,
            };
      }

      async searchByName(params: GetEventDto) {
        const { name, page = 0, limit = 10 } = params;
        
        let where:FindOptionsWhere<Event>[] = [ 
          {
            name: ILike(`${name}%`),
          }
        ];
    
        let events = await this.findAll({
          where,
          select: EVENT_BASIC_SELECT,
          page,
          limit
        });
    
        let mappedEvents = events.map((event) => {
          return {
            ...event
          };
        });
    
        return mappedEvents;
      }

      async update(id: number, params: UpdateEventDto) {
        let event = await this.findOne({ where: { id } });
        for (let key in params) {
          if (key === 'categories') {
            event.categories = await this.categoryService.findByIds(
              params.categories,
            );
          }
          else {
            event[key] = params[key];
          }
        }
    
        await event.save();
    
        return event;
      }
    
      async delete(id: number) {
        let event = await this.eventRepo.findOne({where: { id }})
        if (!event) throw new NotFoundException();
        
        let result = await this.eventRepo.delete({ id });
        if (result.affected === 0) throw new InternalServerErrorException();
    
        await this.eventRepo.delete({ id });
        
        return {
          message: 'Event deleted successfully',
        };
      }

      async takenSeat (params: CreateTicketDto) {

        const takenSeat = await this.eventRepo
            .createQueryBuilder('event')
            .innerJoinAndSelect('event.tickets', 'ticket')
            .where('ticket.seat = :seat', { seat: params.seat })
            .andWhere('event.id = :id', { id: params.eventId })
            .getOne();
  
        return takenSeat
    }
    
}