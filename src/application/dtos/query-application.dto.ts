
import {
  IsOptional,
  IsEnum,
  IsInt,
  Min,
  Max,
  IsString,
} from 'class-validator';

import { Type } from 'class-transformer';

import { ApplicationStatus } from '../enums/application-status.enum.js';

export class QueryApplicationDto {
  @IsOptional()
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;
}
