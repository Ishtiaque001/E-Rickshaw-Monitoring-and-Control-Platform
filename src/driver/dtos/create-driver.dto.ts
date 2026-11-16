import { Type } from "class-transformer";
import { IsString,
        IsNotEmpty,
        IsNumber,
        IsDateString,
        MaxLength,
        isNotEmpty,
} from "class-validator";
export class CreateDriverDto{
    @IsString({
        message : "Name must be in string",
    })
    @IsNotEmpty({
        message : "Name can't be empty",
    })
    @MaxLength(50)
    name :string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(14)
    phone:string;

    @IsDateString()
    dateOfBirtH:string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(105)
    address: string;
}

