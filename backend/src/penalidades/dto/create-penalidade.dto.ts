import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDateString, IsInt, IsOptional, Min } from "class-validator";

export class CreatePenalidadeDto {
    @ApiPropertyOptional({ description: 'ID del crédito asociado', example: 1 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    idCredito?: number | null;

    @ApiPropertyOptional({ description: 'Fecha de la penalidad', example: '2024-06-15' })
    @IsDateString()
    @IsOptional()
    fecha?: string | null;

    @ApiPropertyOptional({ description: 'Monto de la penalidad', example: 50 })
    @Type(() => Number)
    @IsInt()
    @Min(0)
    @IsOptional()
    monto?: number | null;

    @ApiPropertyOptional({ description: 'Descuento de la penalidad', example: 0 })
    @Type(() => Number)
    @IsInt()
    @Min(0)
    @IsOptional()
    descuento?: number | null;
}
