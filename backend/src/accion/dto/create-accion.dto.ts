import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateAccionDto {
    @ApiProperty({ description: 'Nombre de la acción', example: 'CREAR' })
    @IsString()
    @IsNotEmpty()
    nombre!: string;
}
