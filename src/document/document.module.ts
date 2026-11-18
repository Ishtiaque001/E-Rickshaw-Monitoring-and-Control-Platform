
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Document } from './entities/document.entity.js';
import { Application } from '../application/entities/application.entity.js';

import { DocumentController } from './document.controller.js';
import { DocumentService } from './document.service.js';
import { AuthModule } from '../auth/auth.module.js';
import { User } from '../users/entities/user.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Document, Application,User ]),
  AuthModule,
  ],

  controllers: [DocumentController],

  providers: [DocumentService],

  exports: [DocumentService],
})
export class DocumentModule {}
