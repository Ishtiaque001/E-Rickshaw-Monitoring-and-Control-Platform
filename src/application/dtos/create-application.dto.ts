
import {
  IsInt,
  IsPositive,
} from 'class-validator';

export class CreateApplicationDto {
  @IsInt()
  @IsPositive()
  driverId: number;

  @IsInt()
  @IsPositive()
  rickshawId: number;
}
