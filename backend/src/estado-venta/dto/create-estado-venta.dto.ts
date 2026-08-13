import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateEstadoVentaDto {
    @ApiProperty({ description: 'Nombre del estado de venta', example: 'COMPLETADA' })
    @IsString()
    @IsNotEmpty()
    nombre!: string;
}
