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

import { OwnersService } from './owners.service.js';
import { UpdateOwnerDto } from './dto/update-owner.dto.js';
import { CreateOwnerDto } from './dto/create-owner.dto.js';
import { PartialUpdateOwnerDto } from './dto/partial-update-owner.dto.js';
import { OwnerQueryDto } from './dto/owner-query.dto.js';

@Controller('owners')
export class OwnersController {
  constructor(
    private readonly ownersService: OwnersService,
  ) {}

  @Post()
  create(@Body() createOwnerDto: CreateOwnerDto) {
    return this.ownersService.create(createOwnerDto);
  }


@Get()
findAll(@Query() query: OwnerQueryDto) {
    return this.ownersService.findAll(query);
 }


  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOwnerDto: UpdateOwnerDto,
  ) {
    return this.ownersService.update(id, updateOwnerDto);
  }

  
@Patch(':id')
partialUpdate(
  @Param('id', ParseIntPipe) id: number,
  @Body() dto: PartialUpdateOwnerDto,
) {
  return this.ownersService.update(id, dto);
}


@Delete(':id')
remove(
  @Param('id', ParseIntPipe) id: number,
) {
  return this.ownersService.remove(id);
}


@Get(':id/rickshaws')
findRickshaws(
  @Param('id', ParseIntPipe) id: number,
) {
  return this.ownersService.findRickshaws(id);
}

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.ownersService.findOne(id);
  }


}
