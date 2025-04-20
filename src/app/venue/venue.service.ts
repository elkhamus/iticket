import { ConflictException, forwardRef, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsWhere, ILike, In, Not, Repository } from 'typeorm';
import { Venue } from 'src/database/entities/Venue.entity';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
import { FindVenueDto } from './dto/search-venue.dto';
import { VENUE_BASIC_SELECT } from './venue.select';
import { FindParams } from 'src/shared/types/find.params';
import { CreateEventDto } from '../events/dto/create-event.dto';
import { EventsService } from '../events/events.service';

@Injectable()
export class VenueService {
  constructor(


  @Inject(forwardRef(() => EventsService))
    private eventService: EventsService,

    @InjectRepository(Venue)
    private venueRepo: Repository<Venue>,
  ) {}

    findAll(params: FindParams<Venue>){
    const {where, select, relations, limit, page} = params;
    const payload:FindManyOptions<Venue> = {where, select, relations}

    if(limit>0) {
      payload.take = limit;
      payload.skip = limit* page
    }

    return this.venueRepo.find(payload)
  } 

    findOne(params: Omit<FindParams<Venue>, 'limit' | 'page'>) {
    const { where, relations, select } = params;
    return this.venueRepo.findOne({ where, relations, select });
  }

    async searchByName(params?: FindVenueDto) {
    const { name, page = 0, limit = 10 } = params;
        
    let where:FindOptionsWhere<Venue>[] = [ 
        {
            name: ILike(`${name}%`),
        }
    ];
    
    let venues = await this.findAll({
        where,
        select: VENUE_BASIC_SELECT,
        page,
        limit
      });
  
      let mappedVenues = venues.map((event) => {
        return {
          ...venues
        };
      });
  
      return mappedVenues;

  }
  
    async create(params: CreateVenueDto) {

    let checkName = await this.findOne({ where: { name: params.name.toUpperCase() } });

      if (checkName)
        throw new ConflictException('This venue already exists');

    let venue = this.venueRepo.create(params);
    await venue.save();
    return venue;
  }

    async update(id: number, params: UpdateVenueDto) {

    let payload: Partial<Venue> = {};

    let checkName = await this.findOne({
        where: { name: params.name.toUpperCase(), id: Not(id) },
      });
      if (checkName)
        throw new ConflictException('This venue already exists');

    payload.name = params.name;

    await this.update(id, payload);
    return {
        status: true,
        message: 'Venue is successfully updated',
      };
  }

    async delete(id: number) {
    let venue = await this.venueRepo.findOne({where: { id }})
    if (!venue) throw new NotFoundException();

    let event = await this.eventService.findOne({ where: { venue: { id } } });
    if (event) throw new ConflictException('There is an event at this time in this venue');
    
    let result = await this.venueRepo.delete({ id });
    if (result.affected === 0) throw new InternalServerErrorException();



    await this.venueRepo.delete({ id });
    
    return {
      message: 'Venue deleted successfully',
    };
  }


  async existingEvent (params: CreateEventDto) {

      const existingEvent = await this.venueRepo
          .createQueryBuilder('venue')
          .innerJoinAndSelect('venue.events', 'event')
          .where('event.date = :date', { date: params.date })
          .andWhere('event.venue = :venue', { venue: params.venue })
          .getOne();

      return existingEvent  
  }
}