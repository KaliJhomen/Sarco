import { Transform } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsEmail, IsString, MinLength, IsOptional} from "class-validator";

export class RegisterDto {
    @ApiProperty()
    @IsString()
    @MinLength(1)
    nombre!: string;

    @ApiProperty()
    @IsEmail()
    email!: string;

    @ApiProperty()
    @IsString()
    @MinLength(9)
    telefono?: string | null;

    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    idDocumento?: number | null;
    
    @ApiProperty()
    @IsString()
    @MinLength(1)
    documento?: string | null;
    
    @ApiProperty()
    @Transform(({value}) => value.trim())
    @IsString()
    @MinLength(8)
    clave!: string;
}
