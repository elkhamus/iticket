import { PartialType, PickType } from '@nestjs/swagger';
import { CreateEventDto } from './create-event.dto';

export class UpdateEventDto extends PickType(PartialType(CreateEventDto), [
    'description',
    'language',
    'venue',
    'date',
    'ageReq',
    'categories',
  ]) {}