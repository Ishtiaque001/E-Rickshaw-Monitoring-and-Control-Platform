import {
  Controller,
  Post,
  Get,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { OwnersService } from './owners.service.js';
import { UpdateOwnerDto } from './dto/update-owner.dto.js';
import { CreateOwnerDto } from './dto/create-owner.dto.js';
import { PartialUpdateOwnerDto } from './dto/partial-update-owner.dto.js';
import { OwnerQueryDto } from './dto/owner-query.dto.js';

@ApiTags('Owners')
@Controller('owners')
export class OwnersController {
  constructor(
    private readonly ownersService: OwnersService,
  ) {}

  // CREATE OWNER
  @Post()
  @ApiOperation({
    summary: 'Create a new owner',
  })
  @ApiResponse({
    status: 201,
    description: 'Owner created successfully',
  })
  create(@Body() createOwnerDto: CreateOwnerDto) {
    return this.ownersService.create(createOwnerDto);
  }

  // GET ALL OWNERS
  @Get()
  @ApiOperation({
    summary: 'Get all owners with pagination',
  })
  @ApiResponse({
    status: 200,
    description: 'Owners retrieved successfully',
  })
  findAll(@Query() query: OwnerQueryDto) {
    return this.ownersService.findAll(query);
  }

  // UPDATE OWNER
  @Put(':id')
  @ApiOperation({
    summary: 'Update an existing owner',
  })
  @ApiResponse({
    status: 200,
    description: 'Owner updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Owner not found',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOwnerDto: UpdateOwnerDto,
  ) {
    return this.ownersService.update(id, updateOwnerDto);
  }

  // PARTIAL UPDATE OWNER
  @Patch(':id')
  @ApiOperation({
    summary: 'Partially update an owner',
  })
  @ApiResponse({
    status: 200,
    description: 'Owner partially updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Owner not found',
  })
  partialUpdate(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: PartialUpdateOwnerDto,
  ) {
    return this.ownersService.update(id, dto);
  }

  // DELETE OWNER
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete an owner',
  })
  @ApiResponse({
    status: 200,
    description: 'Owner deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Owner not found',
  })
  remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.ownersService.remove(id);
  }

  // GET RICKSHAWS BELONGING TO AN OWNER
  @Get(':id/rickshaws')
  @ApiOperation({
    summary: 'Get all rickshaws belonging to an owner',
  })
  @ApiResponse({
    status: 200,
    description: 'Owner rickshaws retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Owner not found',
  })
  findRickshaws(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.ownersService.findRickshaws(id);
  }

  // GET OWNER BY ID
  @Get(':id')
  @ApiOperation({
    summary: 'Get an owner by ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Owner retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Owner not found',
  })
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.ownersService.findOne(id);
  }
}