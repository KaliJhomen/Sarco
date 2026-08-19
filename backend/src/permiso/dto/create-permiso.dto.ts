import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreatePermisoDto {
    @ApiProperty({ description: 'Nombre del permiso', example: 'CREAR_VENTA' })
    @IsString()
    @MaxLength(255)
    @IsNotEmpty()
    nombre!: string;
}
