import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OwnersController } from './owners.controller.js';
import { OwnersService } from './owners.service.js';
import { Owner } from './owner.entity.js';
import { Rickshaw } from '../rickshaws/rickshaw.entity.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { AuthModule } from '../auth/auth.module.js';
import { User } from '../users/entities/user.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Owner, Rickshaw,User]),
  AuthModule

],
  controllers: [OwnersController],
  providers: [OwnersService,JwtAuthGuard],
  exports: [TypeOrmModule, OwnersService],
})
export class OwnersModule {}
