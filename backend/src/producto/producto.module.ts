import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductoService } from './producto.service';
import { ProductoController } from './producto.controller';

import { Producto } from './entities/producto.entity';
import { TipoProducto } from '../tipo-producto/entities/tipo-producto.entity';
import { ProductoTipoProducto } from '../producto-tipo-producto/entities/producto-tipo-producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Producto, ProductoTipoProducto, TipoProducto,])], 
  controllers: [ProductoController],
  providers: [ProductoService],
})
export class ProductoModule {}
