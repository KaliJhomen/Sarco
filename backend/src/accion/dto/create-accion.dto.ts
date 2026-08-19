import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateAccionDto {
    @ApiProperty({ description: 'Nombre de la acción', example: 'CREAR' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    nombre!: string;
}
