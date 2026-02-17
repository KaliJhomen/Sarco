import { PartialType } from '@nestjs/swagger';
import { CreateProductoTiendaDto } from './create-producto-tienda.dto';

export class UpdateProductoTiendaDto extends PartialType(CreateProductoTiendaDto) {}
