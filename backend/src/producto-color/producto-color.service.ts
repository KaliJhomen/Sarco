import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductoColor } from './entities/producto-color.entity';
import { CreateProductoColorDto } from './dto/create-producto-color.dto';
import { UpdateProductoColorDto } from './dto/update-producto-color.dto';
@Injectable()
export class ProductoColorService {
  constructor(
    @InjectRepository(ProductoColor)
    private readonly productoColorRepository: Repository<ProductoColor>,
  ) {}

  async create(createProductoColorDto: CreateProductoColorDto) {
    return await this.productoColorRepository.save(createProductoColorDto);
  }

  async findAllByProducto(id_producto: number) {
    return await this.productoColorRepository.find({ where: { idProducto: id_producto }, relations: ['producto', 'color'] });
  }

  async update(id: number, updateProductoColorDto: UpdateProductoColorDto) {
    return await this.productoColorRepository.update(id, updateProductoColorDto);
  }

  async remove(id: number) {
    return await this.productoColorRepository.delete(id);
  }
}