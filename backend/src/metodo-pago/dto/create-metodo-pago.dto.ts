import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateMetodoPagoDto {
    @ApiProperty({ description: 'Nombre del método de pago', example: 'EFECTIVO' })
    @IsString()
    @MaxLength(255)
    @IsNotEmpty()
    nombre!: string;
}
