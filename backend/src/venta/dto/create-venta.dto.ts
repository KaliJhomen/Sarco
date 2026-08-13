import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsInt, IsOptional, IsString, Min } from "class-validator";

export class CreateVentaDto {
    @ApiPropertyOptional({ description: 'ID del usuario que registra la venta', example: 1 })
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

    @ApiPropertyOptional({ description: 'ID del comprobante', example: 1 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    idComprobante?: number | null;

    @ApiPropertyOptional({ description: 'ID del método de pago', example: 1 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    idMetodoPago?: number | null;

    @ApiPropertyOptional({ description: 'Número de comprobante', example: 'F001-0001' })
    @IsString()
    @IsOptional()
    numeroComprobante?: string | null;

    @ApiPropertyOptional({ description: 'Fecha y hora de la venta', example: '2024-06-15T10:30:00' })
    @Type(() => Date)
    @IsDate()
    @IsOptional()
    fechaHora?: Date | null;

    @ApiPropertyOptional({ description: 'Impuesto de la venta', example: '18.00' })
    @IsString()
    @IsOptional()
    impuesto?: string | null;

    @ApiPropertyOptional({ description: 'Total de la venta', example: '1180.00' })
    @IsString()
    @IsOptional()
    totalVenta?: string | null;

    @ApiPropertyOptional({ description: 'ID del estado de venta', example: 1 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    idEstadoVenta?: number | null;

    @ApiPropertyOptional({ description: 'Garantía de tienda', example: '6 meses' })
    @IsString()
    @IsOptional()
    garantiaTienda?: string | null;

    @ApiPropertyOptional({ description: 'Descripción de la venta', example: 'Venta de mostrador' })
    @IsString()
    @IsOptional()
    descripcion?: string | null;

    @ApiPropertyOptional({ description: 'ID del registro que origina la venta', example: 1 })
    @Type(() => Number)
    @IsInt()
    @IsOptional()
    registrar?: number | null;

    @ApiPropertyOptional({ description: 'ID de la tienda', example: 1 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    idTienda?: number | null;
}
