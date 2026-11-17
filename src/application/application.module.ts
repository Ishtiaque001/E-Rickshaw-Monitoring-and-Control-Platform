import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service.js';
import { ApplicationController } from './application.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './entities/application.entity.js';
import { Rickshaw } from '../rickshaws/rickshaw.entity.js';
import { Driver } from '../driver/entities/driver.entites.js';
import { User } from '../users/entities/user.entity.js';
import { Owner } from '../owners/owner.entity.js';
import { AuthModule } from '../auth/auth.module.js';
import { Document } from '../document/entities/document.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Application,
      Driver,
      Rickshaw,
      User,
      Document,
    ]),
    AuthModule,

  ],
  controllers: [ApplicationController],
  providers: [ApplicationService],
})
export class ApplicationModule {}
