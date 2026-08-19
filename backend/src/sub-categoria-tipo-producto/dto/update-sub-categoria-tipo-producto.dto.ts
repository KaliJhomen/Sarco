import { PartialType } from '@nestjs/swagger';
import { CreateSubCategoriaTipoProductoDto } from './create-sub-categoria-tipo-producto.dto';

export class UpdateSubCategoriaTipoProductoDto extends PartialType(CreateSubCategoriaTipoProductoDto) {}