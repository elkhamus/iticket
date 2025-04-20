import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Query,
    UseGuards,
  } from '@nestjs/common';
  import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
  import { AuthGard } from 'src/guards/auth.guard';
  import { Roles } from 'src/shared/decorators/roles.decorator';
  import { UserRole } from 'src/shared/enum/user.enum';
import { VenueService } from './venue.service';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
import { FindVenueDto } from './dto/search-venue.dto';
  
  @Controller('venue')
  @ApiTags('Venue')
  @ApiBearerAuth()
  export class VenueController {
    constructor(    
        private venueService: VenueService  
    ) {}
  
    @UseGuards(AuthGard)
    @Roles(UserRole.ADMIN)
    @Get()
    search(@Query() query: FindVenueDto) {
      return this.venueService.searchByName(query);
    }
  
    @UseGuards(AuthGard)
    @Roles(UserRole.ADMIN)
    @Get(':id')
    async venueById(@Param('id') id: number) {
      let venue = await this.venueService.findOne({ where: { id } });
      if (!venue) return {status: 404, message: "This venue doesnt exist"};
      return venue
    }
  
    @UseGuards(AuthGard)
    @Roles(UserRole.ADMIN)
    @Post()
    async create(@Body() body: CreateVenueDto) {
      return await this.venueService.create(body);
    }

    @UseGuards(AuthGard)
    @Roles(UserRole.ADMIN)
    @Post(':id')
    async update(@Param('id') id: number, @Body() body: UpdateVenueDto) {
    return await this.venueService.update(id, body);
    }
  
    @UseGuards(AuthGard)
    @Roles(UserRole.ADMIN)
    @Delete(':id')
    async delete(@Param('id') id: number) {
      return await this.venueService.delete(id);
    }
  }