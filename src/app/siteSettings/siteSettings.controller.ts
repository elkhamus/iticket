import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { SettingsSevice } from "./siteSettings.service";
import { UpdateSettingsDto } from "./dto/update-settings.dto";
import { Roles } from "src/shared/decorators/roles.decorator";
import { UserRole } from "src/shared/enum/user.enum";
import { AuthGard } from "src/guards/auth.guard";

@Controller('settings')
@ApiTags('Settings')
@ApiBearerAuth()
export class SettingsController {

    constructor(

        private settingsService: SettingsSevice

    ) {}

    @Get('show')
    getSettings() {
        return this.settingsService.getSettings();
    }

    @Post('update')
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth()
    @UseGuards(AuthGard)
    async update(@Body() body: UpdateSettingsDto) {
        return await this.settingsService.update(body);
    }

    @Post('lightMode')
    async lightMode(mode: boolean) {
        return await this.settingsService.lightMode(mode);
    }

}