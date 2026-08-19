import { ApiProperty } from "@nestjs/swagger";
import { MaxLength, IsNotEmpty, IsString } from "class-validator";

export class CreateDocumentoDto {
    @ApiProperty({ description: 'Nombre del documento', example: 'DNI' })
    @IsString()
    @MaxLength(50)
    @IsNotEmpty()
    nombre!: string;
}
