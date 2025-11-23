import { PartialType } from '@nestjs/swagger';
import { CreateTipoProductoSubCategoriaDto } from './create-tipo-producto-sub-categoria.dto';

export class UpdateTipoProductoSubCategoriaDto extends PartialType(CreateTipoProductoSubCategoriaDto) {}