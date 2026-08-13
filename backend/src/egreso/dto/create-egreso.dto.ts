import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDateString, IsInt, IsOptional, IsString, Min } from "class-validator";

export class CreateEgresoDto {
    @ApiPropertyOptional({ description: 'ID del usuario que realiza el egreso', example: 1 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    idUsuario?: number | null;

    @ApiPropertyOptional({ description: 'ID de la tienda asociada al egreso', example: 1 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    idTienda?: number | null;

    @ApiPropertyOptional({ description: 'Nombre del egreso', example: 'Compra de suministros' })
    @IsString()
    @IsOptional()
    nombre?: string | null;

    @ApiPropertyOptional({ description: 'Descripción del egreso', example: 'Compra de materiales de oficina' })
    @IsString()
    @IsOptional()
    descripcion?: string | null;

    @ApiPropertyOptional({ description: 'Monto del egreso', example: '150.75' })
    @IsString()
    @IsOptional()
    montoEgreso?: string | null;

    @ApiPropertyOptional({ description: 'Fecha del egreso', example: '2024-06-15' })
    @IsDateString()
    @IsOptional()
    fecha?: string | null;

    @ApiPropertyOptional({ description: 'Estado del egreso', example: 'PENDIENTE' })
    @IsString()
    @IsOptional()
    estado?: string | null;
}
