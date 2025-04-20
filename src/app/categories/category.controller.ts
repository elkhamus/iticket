import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    UseGuards,
  } from '@nestjs/common';
  import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
  import { CategoryService } from './category.service';
  import { CreateCategoryDto } from './dto/create-category.dto';
  import { AuthGard } from 'src/guards/auth.guard';
  import { Roles } from 'src/shared/decorators/roles.decorator';
  import { UserRole } from 'src/shared/enum/user.enum';
  
  @Controller('category')
  @ApiTags('Category')
  @ApiBearerAuth()
  export class CategoryController {
    constructor(
        
        private categoryService: CategoryService
    
    ) {}
  
    @Get()
    list() {
      return this.categoryService.find();
    }
  
    @Get(':id')
    async item(@Param('id') id: number) {
      let category = await this.categoryService.findOne({ where: { id }});
      if (!category) return {status: 404, message: "This category doesnt exist"};
      return category
    }
  
    @UseGuards(AuthGard)
    @Roles(UserRole.ADMIN)
    @Post()
    async create(@Body() body: CreateCategoryDto) {
      return await this.categoryService.create(body);
    }
  
    @UseGuards(AuthGard)
    @Roles(UserRole.ADMIN)
    @Delete(':id')
    async delete(@Param('id') id: number) {
      return await this.categoryService.delete(id);
    }
  }