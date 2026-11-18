import { PartialType } from '@nestjs/mapped-types';
import { CreateOwnerDto } from './create-owner.dto.js';

export class PartialUpdateOwnerDto extends PartialType(CreateOwnerDto) {}
