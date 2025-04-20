import { DataSource } from "typeorm";
import { SiteEntity } from "../entities/Site.entity";

export async function defaultSettings(DataSource: DataSource) {
    let settingsRepo = DataSource.getRepository(SiteEntity);

    let defaultSettings = await settingsRepo.create({
      name: 'I-Ticket',
      lightMode: true,
      aboutUs: 'About Us',
      contactUs: 'Contact Us',
      icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIJaqLZ7xvly9FcECmO5keDCLm5sBk7SEa-w&s"
    })

    await defaultSettings.save()
}