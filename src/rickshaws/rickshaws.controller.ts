import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';

import { RickshawsService } from './rickshaws.service.js';
import { CreateRickshawDto } from './dto/create-rickshaw.dto.js';

@Controller('rickshaws')
export class RickshawsController {
  constructor(
    private readonly rickshawsService: RickshawsService,
  ) {}

  // CREATE RICKSHAW
  @Post()
  create(@Body() dto: CreateRickshawDto) {
    return this.rickshawsService.create(dto);
  }

  // GET ALL RICKSHAWS
  @Get()
  findAll() {
    return this.rickshawsService.findAll();
  }

  // GET RICKSHAW BY ID
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.rickshawsService.findOne(id);
  }

  // UPDATE RICKSHAW
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateRickshawDto,
  ) {
    return this.rickshawsService.update(id, dto);
  }
  // DELETE RICKSHAW
@Delete(':id')
remove(
  @Param('id', ParseIntPipe) id: number,
) {
  return this.rickshawsService.remove(id);
}
}