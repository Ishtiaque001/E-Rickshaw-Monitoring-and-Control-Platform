import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RickshawsController } from './rickshaws.controller.js';
import { RickshawsService } from './rickshaws.service.js';
import { Rickshaw } from './rickshaw.entity.js';
import { Owner } from '../owners/owner.entity.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { User } from '../users/entities/user.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Rickshaw, Owner,User])],
  controllers: [RickshawsController],
  providers: [RickshawsService,JwtAuthGuard],
})
export class RickshawsModule {}
