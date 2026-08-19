import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateComprobanteDto {
    @ApiProperty({ description: 'Nombre del comprobante', example: 'FACTURA' })
    @IsString()
    @MaxLength(255)
    @IsNotEmpty()
    nombre!: string;
}
