import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateEstadoClienteDto {
    @ApiProperty({ description: 'Nombre del estado de cliente', example: 'ACTIVO' })
    @IsString()
    @MaxLength(50)
    @IsNotEmpty()
    nombre!: string;
}
