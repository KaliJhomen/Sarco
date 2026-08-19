import {ApiProperty} from '@nestjs/swagger';
import {IsInt } from 'class-validator';
export class CreateSubCategoriaTipoProductoDto {
    @ApiProperty()
    @IsInt()
    idTipoProducto!: number;

    @ApiProperty()
    @IsInt()
    idSubCategoria!: number;
}
