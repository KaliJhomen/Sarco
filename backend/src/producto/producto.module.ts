import { Module } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { ProductoController } from './producto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { TipoProducto } from 'src/tipo-producto/entities/tipo-producto.entity';
import { ProductoTipoProducto } from 'src/producto-tipo-producto/entities/producto-tipo-producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Producto, ProductoTipoProducto, TipoProducto,])], 
  controllers: [ProductoController],
  providers: [ProductoService],
})
export class ProductoModule {}
