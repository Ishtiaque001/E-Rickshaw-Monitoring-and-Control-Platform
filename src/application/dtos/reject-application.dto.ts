import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  Length,
} from 'class-validator';

export class RejectApplicationDto {
  @ApiProperty({
    example: 'Supporting document is unreadable.',
    minLength: 5,
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty()
  @Length(5, 500)
  rejectionReason: string;
}
