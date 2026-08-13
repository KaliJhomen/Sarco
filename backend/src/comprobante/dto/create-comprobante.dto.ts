import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateComprobanteDto {
    @ApiProperty({ description: 'Nombre del comprobante', example: 'FACTURA' })
    @IsString()
    @IsNotEmpty()
    nombre!: string;
}
