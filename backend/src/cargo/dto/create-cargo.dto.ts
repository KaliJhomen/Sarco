import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class CreateCargoDto {
    @ApiProperty({
        description: 'Nombre del cargo',
        example: 'Gerente'
    })
    @IsNotEmpty()
    @IsString()
    nombre!: string;
}
