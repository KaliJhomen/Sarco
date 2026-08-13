import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDateString, IsInt, IsOptional, IsString, Min } from "class-validator";

export class CreatePlanPagoDto {
    @ApiPropertyOptional({ description: 'ID del crédito asociado', example: 1 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    idCredito?: number | null;

    @ApiPropertyOptional({ description: 'Fecha programada del pago', example: '2024-06-15' })
    @IsDateString()
    @IsOptional()
    fechaProgramada?: string | null;

    @ApiPropertyOptional({ description: 'Número de cuota', example: 1 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    numCuota?: number | null;

    @ApiPropertyOptional({ description: 'Monto de la cuota', example: '100.00' })
    @IsString()
    @IsOptional()
    montoCuota?: string | null;

    @ApiPropertyOptional({ description: 'Estado del plan de pago', example: 'PENDIENTE' })
    @IsString()
    @IsOptional()
    estado?: string | null;
}
