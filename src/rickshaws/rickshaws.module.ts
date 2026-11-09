import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RickshawsController } from './rickshaws.controller.js';
import { RickshawsService } from './rickshaws.service.js';
import { Rickshaw } from './rickshaw.entity.js';
import { Owner } from '../owners/owner.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Rickshaw, Owner])],
  controllers: [RickshawsController],
  providers: [RickshawsService],
})
export class RickshawsModule {}
