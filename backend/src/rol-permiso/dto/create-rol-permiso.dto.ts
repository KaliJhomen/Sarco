import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsInt, IsOptional, Min } from "class-validator";

export class CreateRolPermisoDto {
    @ApiProperty({ description: 'ID del rol', example: 1 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    idRol!: number;

    @ApiProperty({ description: 'ID del módulo', example: 1 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    idModulo!: number;

    @ApiProperty({ description: 'ID de la acción', example: 1 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    idAccion!: number;

    @ApiPropertyOptional({ description: '¿Permiso otorgado?', default: true })
    @IsBoolean()
    @IsOptional()
    permitido?: boolean;
}
