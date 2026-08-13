import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateDocumentoDto {
    @ApiProperty({ description: 'Nombre del documento', example: 'DNI' })
    @IsString()
    @IsNotEmpty()
    nombre!: string;
}
