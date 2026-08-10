import { Module } from '@nestjs/common';
import { TipoProductoSubCategoriaService } from './tipo-producto-sub-categoria.service';
import { TipoProductoSubCategoriaController } from './tipo-producto-sub-categoria.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoProductoSubCategoria } from './entities/tipo-producto-sub-categoria.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TipoProductoSubCategoria])],
  controllers: [TipoProductoSubCategoriaController],
  providers: [TipoProductoSubCategoriaService],
})
export class TipoProductoSubCategoriaModule {}