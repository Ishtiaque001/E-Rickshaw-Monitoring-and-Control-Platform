
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { License } from './entities/license.entity.js';
import { Application } from '../application/entities/application.entity.js';
User
import { LicensesController } from './licenses.controller.js';
import { LicensesService } from './licenses.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { VerificationLog } from '../verification/entities/verification-log.entity.js';
import { AuthModule } from '../auth/auth.module.js';
import { User } from '../users/entities/user.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      License,
      Application,
      VerificationLog,
      User,
    ]),
    AuthModule
  ],
  controllers: [LicensesController],
  providers: [LicensesService,JwtAuthGuard],
  exports: [LicensesService],
})
export class LicensesModule {}
