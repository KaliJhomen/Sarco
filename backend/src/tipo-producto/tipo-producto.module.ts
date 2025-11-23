import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import {TipoProductoService} from './tipo-producto.service';
import {TipoProductoController} from './tipo-producto.controller';

import { TipoProducto } from './entities/tipo-producto.entity';
import { SubCategoria } from 'src/sub-categoria/entities/sub-categoria.entity';
import {TipoProductoSubCategoria} from 'src/TipoProductoSubCategoria/entities/tipo-producto-sub-categoria.entity';
@Module({
  imports: [TypeOrmModule.forFeature([TipoProducto, SubCategoria, TipoProductoSubCategoria])],
  controllers: [TipoProductoController],

  providers: [TipoProductoService],
})
export class TipoProductoModule {}