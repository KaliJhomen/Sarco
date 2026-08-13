import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, Min } from "class-validator";

export class CreateUsuarioRolDto {
    @ApiProperty({ description: 'ID del usuario', example: 1 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    idUsuario!: number;

    @ApiProperty({ description: 'ID del rol', example: 1 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    idRol!: number;
}
