import { Transform } from "class-transformer";
import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterDto {
    @IsString()
    @MinLength(1)
    nombre!: string;

    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(9)
    telefono?: string | null;

    @IsString()
    @MinLength(1)
    documento?: string | null;
    
    @Transform(({value}) => value.trim())
    @IsString()
    @MinLength(8)
    clave!: string;

}