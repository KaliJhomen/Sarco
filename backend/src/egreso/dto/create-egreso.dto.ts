import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsNumber, IsString } from "class-validator";

export class CreateEgresoDto {
    @ApiProperty({
        description: 'ID del usuario que realiza el egreso',
        example: 1
    })
    @IsNumber()
    idUsuario!: number | null;

    @ApiProperty({
        description: 'ID de la tienda asociada al egreso',
        example: 1
    })
    @IsNumber()
    idTienda!: number | null;

    @ApiProperty({
        description: 'Nombre del egreso',
        example: 'Compra de suministros'
    }) 
    @IsString()
    nombre!: string | null;

    @ApiProperty({
        description: 'Descripción del egreso',
        example: 'Compra de materiales de oficina'
    })
    @IsString()
    descripcion!: string | null;

    @ApiProperty({
        description: 'Monto del egreso',
        example: '150.75'
    })
    @IsNumber()
    montoEgreso!: string | null;

    @ApiProperty({
        description: 'Fecha del egreso',
        example: '2024-06-15'
    })
    @Type(() => Date)
    @IsDate()
    fecha!: string | null;

    @ApiProperty({
        description: 'Estado del egreso',
        example: 'PENDIENTE'
    })
    @IsString()
    estado!: string | null;
}
