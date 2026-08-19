import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import {TipoProductoService} from './tipo-producto.service';
import {TipoProductoController} from './tipo-producto.controller';

import { TipoProducto } from './entities/tipo-producto.entity';
import { SubCategoria } from '../sub-categoria/entities/sub-categoria.entity';
import {SubCategoriaTipoProducto} from '../sub-categoria-tipo-producto/entities/sub-categoria-tipo-producto.entity';
@Module({
  imports: [TypeOrmModule.forFeature([TipoProducto, SubCategoria, SubCategoriaTipoProducto])],
  controllers: [TipoProductoController],

  providers: [TipoProductoService],
})
export class TipoProductoModule {}