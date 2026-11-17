import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { DriverModule } from './driver/driver.module.js';
import { ApplicationModule } from './application/application.module.js';
import { DocumentModule } from './document/document.module.js';
import{TypeOrmModule} from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { RickshawsModule } from './rickshaws/rickshaws.module.js';
ConfigModule
@Module({
  imports: [
    ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',}),
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
    ApplicationModule,
    DriverModule,
    DocumentModule,
    RickshawsModule,
   
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}