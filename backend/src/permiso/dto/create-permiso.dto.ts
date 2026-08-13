import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreatePermisoDto {
    @ApiProperty({ description: 'Nombre del permiso', example: 'CREAR_VENTA' })
    @IsString()
    @IsNotEmpty()
    nombre!: string;
}
