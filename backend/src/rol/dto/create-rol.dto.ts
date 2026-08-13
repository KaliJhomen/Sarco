import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateRolDto {
    @ApiProperty({ description: 'Nombre del rol', example: 'ADMIN' })
    @IsString()
    @IsNotEmpty()
    nombre!: string;
}
