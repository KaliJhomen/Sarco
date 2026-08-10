import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateDetalleSeparadoDto {
    @ApiProperty({
        description: 'ID del crédito asociado',
        example: 1
    })
    @IsNumber()
    idSeparado!: number;        // FK crédito

    @ApiProperty({
        description: 'ID del producto asociado',
        example: 1
    })
    @IsNumber()
    idProducto!: number;      // FK producto

    @ApiProperty({
        description: 'Cantidad del producto',
        example: 2
    })
    @IsNumber()
    cantidad!: number | null;        // cantidad del producto

    @ApiProperty({
        description: 'Número de serie del producto',
        example: 'ABC123XYZ'
    })
    @IsString()
    serie!: string | null;           // opcional, número de serie del producto


    @ApiProperty({
        description: 'Descuento aplicado al producto',
        example: '5.00'
    })
    @IsNumber()
    descuento!: string | null;       // descuento aplicado

    @ApiProperty({
        description: 'Monto total después del descuento',
        example: '95.00'
    })
    @IsNumber()
    montoTotal!: string | null;      // monto total después del descuento
    /*
    @ApiProperty({
        description: 'Indica si el producto ha sido despachado (1) o no (0)',
        example: 0
    })
    @IsNumber()
    despachado: number;
    */
    }
