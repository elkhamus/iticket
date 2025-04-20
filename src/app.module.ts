import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from './config';
import { JwtModule } from '@nestjs/jwt';
import { join } from 'path';
import { ClsModule } from 'nestjs-cls';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthModule } from './app/auth/auth.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UserModule } from './app/users/user.module';
import { CategoryModule } from './app/categories/category.module';
import { EventsModule } from './app/events/events.module';
import { UploadModule } from './app/uploads/upload.module';
import { VenueModule } from './app/venue/venue.module';
import { TicketModule } from './app/tickets/ticket.module';
import { SliderModule } from './app/slider/slider.module';
import { SettingsModule } from './app/siteSettings/siteSettings.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: config.database.host,
      port: config.database.port,
      username: config.database.user,
      password: config.database.password,
      database: config.database.database,
      entities: [`${__dirname}/**/*.entity.{ts,js}`],
      synchronize: true,
    }),
    JwtModule.register({
      global: true,
      secret: config.jwtSecret,
      signOptions: { expiresIn: '10d' },
    }),
    EventEmitterModule.forRoot(),
    MailerModule.forRoot({
      transport: {
        host: config.smtp.host,
        port: config.smtp.port,
        auth: {
          user: config.smtp.user,
          pass: config.smtp.password, 
        },
      },
      defaults: {
        from: config.smtp.from,
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
      guard: { mount: true },
    }),
    ServeStaticModule.forRoot({
      serveRoot: '/uploads',
      rootPath: join(__dirname, '../uploads')
    }),
    AuthModule,
    UserModule,
    CategoryModule,
    EventsModule,
    UploadModule,
    VenueModule,
    TicketModule,
    SliderModule,
    SettingsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
