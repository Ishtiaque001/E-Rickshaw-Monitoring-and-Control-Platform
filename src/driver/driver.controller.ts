import { Controller,Get,Post,Put,Patch,Param,Delete,Body,Query,ParseIntPipe,UseGuards} from '@nestjs/common';
import { DriverService } from './driver.service.js';
import { CreateDriverDto } from './dtos/create-driver.dto.js';
import { UpdateDriverDto } from './dtos/update-driver.dto.js';
import { QueryDriverDto } from './dtos/query-driver.dto.js';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
@Controller('drivers')
@UseGuards(JwtAuthGuard)
export class DriverController {
  constructor(private readonly driverService: DriverService) {}
  @Post()
  create(@Body() createDriverDto: CreateDriverDto) {
    return this.driverService.create(createDriverDto);
  }

  @Get()
  findAll(@Query() query: QueryDriverDto) {
    return this.driverService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.driverService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDriverDto: UpdateDriverDto,
  ) {
    return this.driverService.update(id, updateDriverDto);
  }
  @Patch(':id')
  littleupdate(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDriverDto: UpdateDriverDto,
  ) {
    return this.driverService.update(id, updateDriverDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.driverService.remove(id);
  }
}





