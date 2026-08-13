import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDateString, IsInt, IsOptional, IsString, Min } from "class-validator";

export class CreateServicioDto {
    @ApiPropertyOptional({ description: 'ID del usuario que registra el servicio', example: 1 })
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

    @ApiPropertyOptional({ description: 'Nombre del servicio', example: 'Reparación de motor' })
    @IsString()
    @IsOptional()
    nombre?: string | null;

    @ApiPropertyOptional({ description: 'Descripción del servicio', example: 'Cambio de banda' })
    @IsString()
    @IsOptional()
    descripcion?: string | null;

    @ApiPropertyOptional({ description: 'Fecha del servicio', example: '2024-06-15' })
    @IsDateString()
    @IsOptional()
    fecha?: string | null;

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

    @ApiPropertyOptional({ description: 'Precio del servicio', example: '250.00' })
    @IsString()
    @IsOptional()
    precio?: string | null;

    @ApiPropertyOptional({ description: 'Estado del servicio', example: 1 })
    @Type(() => Number)
    @IsInt()
    @IsOptional()
    estado?: number | null;

    @ApiPropertyOptional({ description: 'Número de comprobante', example: 'S001-0001' })
    @IsString()
    @IsOptional()
    numeroComprobante?: string | null;
}
