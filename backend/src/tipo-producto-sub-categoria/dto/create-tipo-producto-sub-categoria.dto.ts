import {ApiProperty} from '@nestjs/swagger';
import {IsNumber } from 'class-validator';
export class CreateTipoProductoSubCategoriaDto {
    @ApiProperty()
    @IsNumber()
    idTipoProducto: number;

    @ApiProperty()
    @IsNumber()
    idSubCategoria: number;
}
