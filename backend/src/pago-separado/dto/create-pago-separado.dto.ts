import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsInt, IsOptional, IsString, Min } from "class-validator";

export class CreatePagoSeparadoDto {
    @ApiPropertyOptional({ description: 'ID del separado', example: 1 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    idSeparado?: number | null;

    @ApiPropertyOptional({ description: 'ID del usuario que registra el pago', example: 1 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    idUsuario?: number | null;

    @ApiPropertyOptional({ description: 'Fecha del pago', example: '2024-06-15T10:30:00' })
    @Type(() => Date)
    @IsDate()
    @IsOptional()
    fecha?: Date | null;

    @ApiPropertyOptional({ description: 'Monto del pago', example: '200.00' })
    @IsString()
    @IsOptional()
    montoPago?: string | null;

    @ApiPropertyOptional({ description: 'ID de la tienda', example: 1 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    idTienda?: number | null;

    @ApiPropertyOptional({ description: 'ID del método de pago', example: 1 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    idMetodoPago?: number | null;

    @ApiPropertyOptional({ description: 'Número de comprobante', example: 'F001-0001' })
    @IsString()
    @IsOptional()
    numComprobante?: string | null;
}
