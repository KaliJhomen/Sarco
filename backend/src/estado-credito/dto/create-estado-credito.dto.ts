import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateEstadoCreditoDto {
    @ApiProperty({ description: 'Nombre del estado de crédito', example: 'PENDIENTE' })
    @IsString()
    @IsNotEmpty()
    nombre!: string;
}
