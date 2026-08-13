import { Type } from 'class-transformer';
import { IsString, IsInt, IsOptional, IsEnum, IsDateString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { EstadoGarantia } from '../enums/estado-garantia.enum';

export class CreateGarantiaDto {
    @ApiPropertyOptional({ description: 'ID del usuario que registra la garantía', example: 1 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    idUsuario?: number | null;

    @ApiPropertyOptional({ description: 'ID del cliente', example: 1 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    idCliente?: number | null;

    @ApiPropertyOptional({ description: 'ID del producto', example: 1 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    idProducto?: number | null;

    @ApiPropertyOptional({ description: 'ID de la tienda', example: 1 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    idTienda?: number | null;

    @ApiPropertyOptional({ description: 'Descripción de la garantía', example: 'Garantía por falla de fábrica' })
    @IsString()
    @IsOptional()
    descripcion?: string | null;

    @ApiProperty({ type: String, format: 'date', description: 'Fecha de ingreso', example: '2024-06-15' })
    @IsDateString()
    fechaIngreso: string;

    @ApiPropertyOptional({ description: 'Fecha de devolución', example: '2024-07-15', type: String, format: 'date' })
    @IsDateString()
    @IsOptional()
    fechaDevolucion?: string | null;

    @ApiPropertyOptional({ description: 'Estado de la garantía', enum: EstadoGarantia })
    @IsEnum(EstadoGarantia)
    @IsOptional()
    estado?: EstadoGarantia | null;
}
