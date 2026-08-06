import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEmail, IsArray, ValidateNested, IsInt, Min, IsOptional } from "class-validator";
import { Type } from "class-transformer";

class PedidoItemDto {
  @ApiProperty({ description: 'ID del producto a agregar' })
  @IsInt()
  idProducto: number;

  @ApiProperty({ description: 'Cantidad del producto' })
  @IsInt()
  @Min(1)
  cantidad: number;
}

export class CreatePedidoDto {
  @ApiProperty({ description: 'Nombre del cliente' })
  @IsString()
  nombre: string;

  @ApiProperty({ description: 'Email del cliente' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ description: 'Teléfono del cliente' })
  @IsString()
  telefono: string;

  @ApiProperty({ description: 'Dirección de envío' })
  @IsString()
  direccion: string;

  @ApiProperty({ description: 'Ciudad de envío' })
  @IsString()
  ciudad: string;

  @ApiProperty({ description: 'Token de sesión para usuarios invitados', required: false })
  @IsOptional()
  @IsString()
  sessionToken?: string;

  @ApiProperty({ type: [PedidoItemDto], description: 'Lista de productos a comprar' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PedidoItemDto)
  items: PedidoItemDto[];
}