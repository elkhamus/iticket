import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SiteEntity } from "src/database/entities/Site.entity";
import { SettingsController } from "./siteSettings.controller";
import { SettingsSevice } from "./siteSettings.service";

@Module({
    imports: [TypeOrmModule.forFeature([SiteEntity])],
    controllers: [SettingsController],
    providers: [SettingsSevice],
    exports: [SettingsSevice]
})

export class SettingsModule {}