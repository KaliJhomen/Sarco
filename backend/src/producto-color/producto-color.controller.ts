import { Controller, Post, Body, Param, Get, Patch, Delete } from '@nestjs/common';
import { ProductoColorService } from './producto-color.service';
import { CreateProductoColorDto } from './dto/create-producto-color.dto';
import { UpdateProductoColorDto } from './dto/update-producto-color.dto';

@Controller('producto-color')
export class ProductoColorController {
  constructor(private readonly productoColorService: ProductoColorService) {}

  @Post()
  create(@Body() createProductoColorDto: CreateProductoColorDto) {
    return this.productoColorService.create(createProductoColorDto);
  }

  @Get('producto/:id')
  findAllByProducto(@Param('id') id: string) {
    return this.productoColorService.findAllByProducto(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductoColorDto: UpdateProductoColorDto) {
    return this.productoColorService.update(Number(id), updateProductoColorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productoColorService.remove(Number(id));
  }
}