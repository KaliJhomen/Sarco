import { ApiProperty } from '@nestjs/swagger';
import { Transform } from "class-transformer";
import { IsEmail, IsString, MinLength, IsOptional } from "class-validator";

export class LoginDto {
    
    @ApiProperty()
    @IsEmail()
    @IsString()
    email!: string;

    @ApiProperty()
    @Transform(({value}) => value.trim())
    @IsString()
    @MinLength(1)
    password!: string;

    @IsOptional()
    @IsString()
    sessionToken?: string;
}