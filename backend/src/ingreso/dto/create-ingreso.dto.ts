import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsInt, IsOptional, IsString, Min } from "class-validator";

export class CreateIngresoDto {
    @ApiPropertyOptional({ description: 'ID del usuario que registra el ingreso', example: 1 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    idUsuario?: number | null;

    @ApiPropertyOptional({ description: 'ID de la tienda', example: 1 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    idTienda?: number | null;

    @ApiPropertyOptional({ description: 'Tipo de ingreso', example: 'VENTA' })
    @IsString()
    @IsOptional()
    tipoIngreso?: string | null;

    @ApiPropertyOptional({ description: 'Monto del ingreso', example: '150.75' })
    @IsString()
    @IsOptional()
    montoIngreso?: string | null;

    @ApiPropertyOptional({ description: 'ID del método de pago', example: 1 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    idMetodoPago?: number | null;

    @ApiPropertyOptional({ description: 'Fecha y hora del ingreso', example: '2024-06-15T10:30:00' })
    @Type(() => Date)
    @IsDate()
    @IsOptional()
    fechaHora?: Date | null;

    @ApiPropertyOptional({ description: 'Número de comprobante', example: 'F001-0001' })
    @IsString()
    @IsOptional()
    numeroComprobante?: string | null;

    @ApiPropertyOptional({ description: 'Estado del ingreso', example: 'CONFIRMADO' })
    @IsString()
    @IsOptional()
    estado?: string | null;
}
