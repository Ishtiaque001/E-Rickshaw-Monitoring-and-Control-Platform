import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { DriverModule } from './driver/driver.module.js';
import { ApplicationModule } from './application/application.module.js';
import { DocumentModule } from './document/document.module.js';

@Module({
  imports: [DriverModule, ApplicationModule, DocumentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
