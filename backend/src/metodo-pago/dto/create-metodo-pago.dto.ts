import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateMetodoPagoDto {
    @ApiProperty({ description: 'Nombre del método de pago', example: 'EFECTIVO' })
    @IsString()
    @IsNotEmpty()
    nombre!: string;
}
