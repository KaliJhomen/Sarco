import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsDateString, IsInt, IsOptional, IsString, Min } from "class-validator";

export class CreateSeparadoDto {
    @ApiPropertyOptional({ description: 'ID del usuario que registra el separado', example: 1 })
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

    @ApiPropertyOptional({ description: 'ID del método de pago', example: 1 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    idMetodoPago?: number | null;

    @ApiPropertyOptional({ description: 'Fecha de inicio del separado', example: '2024-06-15' })
    @IsDateString()
    @IsOptional()
    fechaInicio?: string | null;

    @ApiPropertyOptional({ description: 'Deuda total', example: '1200.00' })
    @IsString()
    @IsOptional()
    deudaTotal?: string | null;

    @ApiPropertyOptional({ description: 'Deuda pagada', example: '200.00' })
    @IsString()
    @IsOptional()
    deudaPagada?: string | null;

    @ApiPropertyOptional({ description: 'Deuda restante', example: '1000.00' })
    @IsString()
    @IsOptional()
    deudaRestante?: string | null;

    @ApiPropertyOptional({ description: 'Estado del separado', default: true })
    @IsBoolean()
    @IsOptional()
    estado?: boolean | null;

    @ApiPropertyOptional({ description: 'Descripción del separado', example: 'Separado a 3 meses' })
    @IsString()
    @IsOptional()
    descripcion?: string | null;

    @ApiPropertyOptional({ description: 'ID del comprobante', example: 1 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    idComprobante?: number | null;

    @ApiPropertyOptional({ description: 'ID del registro que origina el separado', example: 1 })
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
