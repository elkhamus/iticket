import { OmitType } from '@nestjs/swagger';
import { CreateUserDto } from '../../users/dto/create-user.dto';

export class RegisterUserDto extends OmitType(CreateUserDto, ['roles']) {}
