import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoTipoProducto } from './entities/producto-tipo-producto.entity';
import { ProductoTipoProductoService } from './producto-tipo-producto.service';
import { ProductoTipoProductoController } from './producto-tipo-producto.controller';
@Module({
  imports: [TypeOrmModule.forFeature([ProductoTipoProducto])],
  controllers: [ProductoTipoProductoController],
  providers: [ProductoTipoProductoService],
})
export class ProductoTipoProductoModule {}
