import {
  IsInt,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  Min,
  MaxLength,
} from 'class-validator';

import { RickshawStatus } from '../rickshaw.entity.js';

export class CreateRickshawDto {
  @IsInt()
  @Min(1)
  ownerId: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  registrationNumber: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  model: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  chassisNumber: string;

  @IsOptional()
  @IsEnum(RickshawStatus)
  status?: RickshawStatus;
}