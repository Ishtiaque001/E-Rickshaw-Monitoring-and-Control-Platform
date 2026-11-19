import {
  IsInt,
  IsPositive,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateApplicationDto {
  @ApiProperty({
    example: 1,
    minimum: 1,
    description: 'Existing driver ID',
  })
  @IsInt()
  @IsPositive()
  driverId: number;
  @ApiProperty({
  example: 1,
  minimum: 1,
  description: 'Existing rickshaw ID',
})

  @IsInt()
  @IsPositive()
  rickshawId: number;
}
