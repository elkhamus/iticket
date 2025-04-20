import { Body, Controller, Delete, Get, NotFoundException, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { AuthGard } from 'src/guards/auth.guard';
import { User } from 'src/database/entities/User.entity';
import { ClsService } from 'nestjs-cls';
import { UpdateUserDto } from './dto/update-user.dto';
import { USER_PROFILE_SELECT } from './user.select';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { UserRole } from 'src/shared/enum/user.enum';

@Controller('user')
@ApiTags('User')
@ApiBearerAuth()
export class UserController {
  constructor(

    private userService: UserService,
    private cls: ClsService
    
  ) {}

  @Get('my_profile')
  @UseGuards(AuthGard)
  async myProfile() {
    let user = await this.cls.get<User>('user');
    return this.userService.findOne({
      where: { id: user.id },
      select: USER_PROFILE_SELECT,
    });
  }

  @Post('update_profile')
  @UseGuards(AuthGard)
  async updateProfile(@Body() body: UpdateUserDto) {
    return this.userService.updateProfile(body);
  }
  
  @Post('update_profile/:id')
  @UseGuards(AuthGard)
  @Roles(UserRole.ADMIN)
  async update(@Param('id') id: number, @Body() body: UpdateUserDto) {
    return this.userService.update(id, body);
  }

  @Get('profile/:id')
  @UseGuards(AuthGard)
  @Roles(UserRole.ADMIN)
  async userProfile(@Param('id') id: number) {
    let user = await this.userService.userProfile(id);
    if (!user) return {status: 404, message: "This user doesnt exist"};
    return user;
  }

  @Delete('profile/:id')
  @UseGuards(AuthGard)
  @Roles(UserRole.ADMIN)
  delete(@Param('id') id: number) {
    return this.userService.delete(id);
  }

}
