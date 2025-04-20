import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SiteEntity } from "src/database/entities/Site.entity";
import { Repository } from "typeorm";
import { UpdateSettingsDto } from "./dto/update-settings.dto";

@Injectable()
export class SettingsSevice {

    constructor (

        @InjectRepository(SiteEntity)
        private siteRepo: Repository<SiteEntity>,

    ) {}

    getSettings() {
        return this.siteRepo.findOne({where: {id: 1}});
    }

    async lightMode(mode: boolean) {
        let settings = await this.getSettings();

        settings.lightMode = mode;
        
        await settings.save();

        return {
            status: true
        }

    }

    async update(params: UpdateSettingsDto) {
            let settings = await this.getSettings();
            for (let key in params) {
                settings[key] = params[key];
            }
        
            await settings.save();
        
            return settings;
          
}
}