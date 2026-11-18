import { Module } from '@nestjs/common';
import { DriverService } from './driver.service.js';
import { DriverController } from './driver.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Driver } from './entities/driver.entites.js';
import { AuthModule } from '../auth/auth.module.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { User } from '../users/entities/user.entity.js';
import { Application } from '../application/entities/application.entity.js';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Driver,User,Application])
  ],
  controllers: [DriverController],
  providers: [DriverService, JwtAuthGuard],
})
export class DriverModule {}
