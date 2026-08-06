import { Transform } from "class-transformer";
import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterDto {
    @IsString()
    @MinLength(1)
    name?: string;

    @IsEmail()
    email!: string;
    /*
    @IsString()
    @MinLength(9)
    phone!: string;

    @IsString()
    @MinLength(1)
    document!: string;
    */
    @Transform(({value}) => value.trim())
    @IsString()
    @MinLength(8)
    password!: string;

}