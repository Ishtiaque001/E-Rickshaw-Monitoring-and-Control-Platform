import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { DriverModule } from './driver/driver.module.js';
import { ApplicationModule } from './application/application.module.js';
import { DocumentModule } from './document/document.module.js';
import{TypeOrmModule} from '@nestjs/typeorm';
@Module({
  imports: [
    DriverModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'zidanislam',
      password: 'admin',
      database: 'ermcp_db',
      autoLoadEntities: true,
      //entities: [Users],
      synchronize: true,
    }),
   
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}