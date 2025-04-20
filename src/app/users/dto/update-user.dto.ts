import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PickType(PartialType(CreateUserDto), [
  'firstName',
  'lastName',
  'number',
  'birthDate',
]) {
}