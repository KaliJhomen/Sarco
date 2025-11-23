import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TipoProductoSubCategoriaService } from './tipo-producto-sub-categoria.service';
import { CreateTipoProductoSubCategoriaDto } from './dto/create-tipo-producto-sub-categoria.dto';
import { UpdateTipoProductoSubCategoriaDto } from './dto/update-tipo-producto-sub-categoria.dto';

@Controller('tipo-producto-sub-categoria')
export class TipoProductoSubCategoriaController {
  constructor(private readonly tipoProductoSubCategoriaService: TipoProductoSubCategoriaService) {}

  @Post()
  create(@Body() createTipoProductoSubCategoriaDto: CreateTipoProductoSubCategoriaDto) {
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
  update(@Param('id') id: string, @Body() updateTipoProductoSubCategoriaDto: UpdateTipoProductoSubCategoriaDto) {
    return this.tipoProductoSubCategoriaService.update(+id, updateTipoProductoSubCategoriaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tipoProductoSubCategoriaService.remove(+id);
  }
}
