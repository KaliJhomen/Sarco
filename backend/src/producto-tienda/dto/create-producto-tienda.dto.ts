import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";
export class CreateProductoTiendaDto {
    @ApiProperty()
    @IsNumber()
    idProducto?: number | null;

    @ApiProperty( {required:false})
    @IsNumber()
    idTienda?: number | null;

    @ApiProperty({ required: false })
    @IsNumber()
    @IsOptional()
    cantidad?: number | null;

}
