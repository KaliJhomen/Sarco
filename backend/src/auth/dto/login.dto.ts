import { ApiProperty } from '@nestjs/swagger';
import { Transform } from "class-transformer";
import { IsEmail, IsString, MinLength } from "class-validator";

export class LoginDto {
    @ApiProperty()
    @IsString()
    login: string;

    @ApiProperty()
    @Transform(({value}) => value.trim())
    @IsString()
    @MinLength(1)
    clave: string;
}