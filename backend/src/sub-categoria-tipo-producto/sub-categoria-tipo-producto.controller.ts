import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TipoProductoSubCategoriaService } from './sub-categoria-tipo-producto.service';
import { CreateSubCategoriaTipoProductoDto } from './dto/create-sub-categoria-tipo-producto.dto';
import { UpdateSubCategoriaTipoProductoDto } from './dto/update-sub-categoria-tipo-producto.dto';

@Controller('tipo-producto-sub-categoria')
export class TipoProductoSubCategoriaController {
  constructor(private readonly tipoProductoSubCategoriaService: TipoProductoSubCategoriaService) {}

  @Post()
  create(@Body() createTipoProductoSubCategoriaDto: CreateSubCategoriaTipoProductoDto) {
    return this.tipoProductoSubCategoriaService.create(createTipoProductoSubCategoriaDto);
  }

  @Get()
  findAll() {
    return this.tipoProductoSubCategoriaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipoProductoSubCategoriaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTipoProductoSubCategoriaDto: UpdateSubCategoriaTipoProductoDto) {
    return this.tipoProductoSubCategoriaService.update(+id, updateTipoProductoSubCategoriaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tipoProductoSubCategoriaService.remove(+id);
  }
}
