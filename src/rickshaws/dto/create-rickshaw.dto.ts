import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { RickshawStatus } from '../rickshaw.entity.js';

export class CreateRickshawDto {
  @ApiProperty({
    example: 'DHAKA-METRO-001',
    description: 'Unique registration number of the rickshaw',
  })
  @IsString()
  @IsNotEmpty()
  registrationNumber: string;

  @ApiProperty({
    example: 1,
    minimum: 1,
    description: 'ID of an owner that already exists in the owners table',
  })
  @IsInt()
  @Min(1)
  ownerId: number;

  @ApiProperty({
    example: 'Easy Bike 2026',
    description: 'Model of the rickshaw',
  })
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty({
    example: 'CHASSIS-001',
    description: 'Unique chassis number of the rickshaw',
  })
  @IsString()
  @IsNotEmpty()
  chassisNumber: string;

  @ApiPropertyOptional({
    enum: RickshawStatus,
    example: RickshawStatus.ACTIVE,
    default: RickshawStatus.ACTIVE,
    description: 'Rickshaw status; ACTIVE if omitted',
  })
  @IsOptional()
  @IsEnum(RickshawStatus)
  status?: RickshawStatus;
}





