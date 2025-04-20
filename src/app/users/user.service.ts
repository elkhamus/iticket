import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/database/entities/User.entity';
import { FindManyOptions, Not, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { USER_PROFILE_SELECT } from './user.select';
import { ClsService } from 'nestjs-cls';
import { FindParams } from 'src/shared/types/find.params';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private cls: ClsService,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  findOne(params: Omit<FindParams<User>, 'limit' | 'page'>) {
    const { where, relations, select } = params;
    return this.userRepo.findOne({ where, relations, select });
  }

  async userProfile(id: number) {
    const myUser = await this.cls.get<User>('user');

    const user = await this.findOne({
      where: { id },
      select: USER_PROFILE_SELECT,
    });

    if (!user) throw new NotFoundException('User is not found');

    return user;
  }
  
  async create(params: Partial<CreateUserDto>) {
    let checkNumber = await this.findOne({
      where: { number: params.number },
    });
    if (checkNumber)
      throw new ConflictException('This number already exists');

    let checkUserEmail = await this.findOne({ where: { email: params.email } });
    if (checkUserEmail)
      throw new ConflictException('This email already exists');

    let user = this.userRepo.create(params);

    await user.save();

    return user;
  }
  
  async updateProfile(params: Partial<UpdateUserDto>) {
    let myUser = await this.cls.get<User>('user');

    let payload: Partial<User> = {};
    for (let key in params) {
      switch (key) {
        case 'number':
          let checkNumber = await this.findOne({
            where: { number: params.number, id: Not(myUser.id) },
          });
          if (checkNumber)
            throw new ConflictException('This number already exists');

          payload.number = params.number;
          
          break;
        default:
          payload[key] = params[key];
          break;
      }
    }

    await this.update(myUser.id, payload);
    return {
      status: true,
      message: 'Profile is successfully updated',
    };
  }

  async update(id: number, params: Partial<User>) {

    let payload: Partial<User> = {};
    for (let key in params) {
      switch (key) {
        case 'number':
          let checkNumber = await this.findOne({
            where: { number: params.number, id: Not(id) },
          });
          if (checkNumber)
            throw new ConflictException('This number already exists');

          payload.number = params.number;
          
          break;
        default:
          payload[key] = params[key];
          break;
      }
    }

    return await this.userRepo.update({ id }, payload);
  }

  async delete(id: number) {
  
    const result = await this.userRepo.delete({ id });
  
    if (result.affected === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  
    return {
      message: 'User is deleted successfully',
    };
  }
}
