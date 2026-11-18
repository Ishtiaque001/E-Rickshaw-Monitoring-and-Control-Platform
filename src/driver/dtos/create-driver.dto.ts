import { Type } from "class-transformer";
import { ApiProperty } from '@nestjs/swagger';
import { IsString,
        IsNotEmpty,
        IsDateString,
        MaxLength,
} from "class-validator";
export class CreateDriverDto{
    @ApiProperty({
        example: 'Limon Ahmed',
        maxLength: 50,
    })
    @IsString({
        message : "Name must be in string",
    })
    @IsNotEmpty({
        message : "Name can't be empty",
    })
    @MaxLength(50)
    name :string;

    @ApiProperty({
    example: '01712345678',
    maxLength: 14,
    })
    @IsNotEmpty()
    @IsString()
    @MaxLength(14)
    phone:string;
    @ApiProperty({
        example: '1998-05-20',
        format: 'date',
        description: 'Date of birth; cannot be in the future',
 })
    @IsDateString()
    dateOfBirth:string;
    @ApiProperty({
    example: 'Aftabnagar, Dhaka',
    maxLength: 105,
 })
    @IsString()
    @IsNotEmpty()
    @MaxLength(105)
    address: string;
}

