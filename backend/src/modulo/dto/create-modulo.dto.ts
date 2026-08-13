import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateModuloDto {
    @ApiProperty({ description: 'Nombre del módulo', example: 'VENTAS' })
    @IsString()
    @IsNotEmpty()
    nombre!: string;

    @ApiPropertyOptional({ description: 'Descripción del módulo', example: 'Gestión de ventas' })
    @IsString()
    @IsOptional()
    descripcion?: string | null;
}
