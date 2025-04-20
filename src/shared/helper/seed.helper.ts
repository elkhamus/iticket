import { NestFactory } from "@nestjs/core";
import { AppModule } from "src/app.module";
import { defaultAdmin } from "src/database/seed/default-admin.seed";
import { defaultSettings } from "src/database/seed/default-settings.seed";
import { DataSource } from "typeorm";

export async function runSeed() {

    const app = await NestFactory.create(AppModule);
    const datasource = app.get(DataSource);

    await defaultSettings(datasource)

    await defaultAdmin(datasource)

    process.exit(1);

}

runSeed();