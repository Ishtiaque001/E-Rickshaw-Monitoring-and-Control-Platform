import { Controller,Get,Post,Put,Patch,Param,Delete,Body,Query,ParseIntPipe,UseGuards} from '@nestjs/common';
import { DriverService } from './driver.service.js';
import { CreateDriverDto } from './dtos/create-driver.dto.js';
import { UpdateDriverDto } from './dtos/update-driver.dto.js';
import { QueryDriverDto } from './dtos/query-driver.dto.js';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@ApiTags('Drivers')
@ApiBearerAuth()
@ApiResponse({
  status: 400,
  description: 'Invalid input, query parameters or driver ID.',
})
@ApiResponse({
  status: 401,
  description: 'Missing or invalid token, or inactive account.',
})

@Controller('drivers')
@UseGuards(JwtAuthGuard)
export class DriverController {
  constructor(private readonly driverService: DriverService) {}
  @Post()
  @ApiOperation({ summary: 'Register a driver' })
  @ApiResponse({
    status: 201,
    description: 'Driver created successfully.',
  })
  @ApiResponse({
    status: 409,
    description: 'A driver with the same unique details already exists.',
  })
  create(@Body() createDriverDto: CreateDriverDto) {
    return this.driverService.create(createDriverDto);
  }

  @Get()
  @ApiOperation({
  summary: 'List drivers',
  description: 'Search by name or phone, with pagination.',
})
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    schema: { type: 'integer', minimum: 1, default: 1 },
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    schema: {
      type: 'integer',
      minimum: 1,
      maximum: 100,
      default: 10,
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Returns drivers and pagination metadata.',
  })
  findAll(@Query() query: QueryDriverDto) {
    return this.driverService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a driver by ID' })
  @ApiResponse({ status: 200, description: 'Driver found.' })
  @ApiResponse({ status: 404, description: 'Driver not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.driverService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a driver using PUT' })
  @ApiResponse({
    status: 200,
    description: 'Returns a driver update confirmation message.',
  })
  @ApiResponse({ status: 404, description: 'Driver not found.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDriverDto: UpdateDriverDto,
  ) {
    return this.driverService.update(id, updateDriverDto);
  }
  @Patch(':id')

  @ApiOperation({ summary: 'Partially update a driver using PATCH' })
  @ApiResponse({
    status: 200,
    description: 'Returns a driver update confirmation message.',
  })
  @ApiResponse({ status: 404, description: 'Driver not found.' })

  littleupdate(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDriverDto: UpdateDriverDto,
  ) {
    return this.driverService.update(id, updateDriverDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a driver' })
  @ApiResponse({
    status: 200,
    description: 'Returns a deletion confirmation message.',
  })
  @ApiResponse({ status: 404, description: 'Driver not found.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.driverService.remove(id);
  }
}





