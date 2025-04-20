import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/database/entities/Category.entity';
import { In, Not, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { FindParams } from 'src/shared/types/find.params';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
  ) {}

  find(params?: Omit<FindParams<Category>, 'limit' | 'page'>) {
    const { where, select, relations } = params || {};
    return this.categoryRepo.find({ where, select, relations });
  }

  findByIds(ids: number[]) {
    return this.categoryRepo.findBy({ id: In(ids) });
  }

  findOne(params?: Omit<FindParams<Category>, 'limit' | 'page'>) {
    const { where, select, relations } = params;
    return this.categoryRepo.findOne({ where, select, relations });
  }

  async create(params: CreateCategoryDto) {
    
    let checkName = await this.findOne({
      where: { name: params.name.toUpperCase()},
    });
    if (checkName)
      throw new ConflictException('This category already exists');

    let category = this.categoryRepo.create(params);
    
    await category.save();
    return category;
  }
  
  async update(id: number, params: UpdateCategoryDto) {

    let payload: Partial<Category> = {};

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
    let result = await this.categoryRepo.delete({ id });
    if (result.affected === 0) throw new NotFoundException();
    return {
      message: 'Category is deleted successfully',
    };
  }
}