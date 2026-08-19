import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional } from "class-validator";
export class CreateProductoTiendaDto {
    @ApiProperty()
    @IsInt()
    idProducto?: number | null;

    @ApiProperty( {required:false})
    @IsInt()
    idTienda?: number | null;

    @ApiProperty({ required: false })
    @IsInt()
    @IsOptional()
    cantidad?: number | null;

}
