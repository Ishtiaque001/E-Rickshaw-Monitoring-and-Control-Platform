
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { License } from './entities/license.entity.js';
import { Application } from '../applications/entities/application.entity';

import { LicensesController } from './licenses.controller.js';
import { LicensesService } from './licenses.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      License,
      Application,
    ]),
  ],
  controllers: [LicensesController],
  providers: [LicensesService],
  exports: [LicensesService],
})
export class LicensesModule {}
