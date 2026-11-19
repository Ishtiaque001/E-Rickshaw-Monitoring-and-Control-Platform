import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OwnersController } from './owners.controller.js';
import { OwnersService } from './owners.service.js';
import { Owner } from './owner.entity.js';
import { Rickshaw } from '../rickshaws/rickshaw.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Owner, Rickshaw])],
  controllers: [OwnersController],
  providers: [OwnersService],
  exports: [TypeOrmModule, OwnersService],
})
export class OwnersModule {}
