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

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { RickshawsService } from './rickshaws.service.js';
import { CreateRickshawDto } from './dto/create-rickshaw.dto.js';

@ApiTags('Rickshaws')
@Controller('rickshaws')
export class RickshawsController {
  constructor(
    private readonly rickshawsService: RickshawsService,
  ) {}

  // CREATE RICKSHAW
  @Post()
  @ApiOperation({
    summary: 'Create a new rickshaw',
  })
  @ApiResponse({
    status: 201,
    description: 'Rickshaw created successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Owner not found',
  })
  create(@Body() dto: CreateRickshawDto) {
    return this.rickshawsService.create(dto);
  }

  // GET ALL RICKSHAWS
  @Get()
  @ApiOperation({
    summary: 'Get all rickshaws',
  })
  @ApiResponse({
    status: 200,
    description: 'Rickshaws retrieved successfully',
  })
  findAll() {
    return this.rickshawsService.findAll();
  }

  // GET RICKSHAW BY ID
  @Get(':id')
  @ApiOperation({
    summary: 'Get a rickshaw by ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Rickshaw retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Rickshaw not found',
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.rickshawsService.findOne(id);
  }

  // UPDATE RICKSHAW
  @Put(':id')
  @ApiOperation({
    summary: 'Update an existing rickshaw',
  })
  @ApiResponse({
    status: 200,
    description: 'Rickshaw updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Rickshaw or owner not found',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateRickshawDto,
  ) {
    return this.rickshawsService.update(id, dto);
  }

  // DELETE RICKSHAW
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a rickshaw',
  })
  @ApiResponse({
    status: 200,
    description: 'Rickshaw deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Rickshaw not found',
  })
  remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.rickshawsService.remove(id);
  }
}