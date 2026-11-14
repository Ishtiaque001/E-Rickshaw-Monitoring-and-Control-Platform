
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { License } from '../licenses/entities/license.entity.js';
import { VerificationLog } from './entities/verification-log.entity.js';

import { VerificationController } from './verification.controller.js';
import { VerificationService } from './verification.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      License,
      VerificationLog,
    ]),
  ],

  controllers: [VerificationController],

  providers: [VerificationService],

  exports: [VerificationService],
})
export class VerificationModule {}
