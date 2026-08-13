import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateEstadoClienteDto {
    @ApiProperty({ description: 'Nombre del estado de cliente', example: 'ACTIVO' })
    @IsString()
    @IsNotEmpty()
    nombre!: string;
}
