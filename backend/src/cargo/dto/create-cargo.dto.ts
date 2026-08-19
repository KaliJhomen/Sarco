import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, MaxLength } from "class-validator";

export class CreateCargoDto {
    @ApiProperty({
        description: 'Nombre del cargo',
        example: 'Gerente'
    })
    @IsNotEmpty()
    @MaxLength(255)
    @IsString()
    nombre!: string;
}
