import { Module } from '@nestjs/common';
import { TipoProductoSubCategoriaService } from './sub-categoria-tipo-producto.service';
import { TipoProductoSubCategoriaController } from './sub-categoria-tipo-producto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubCategoriaTipoProducto } from './entities/sub-categoria-tipo-producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubCategoriaTipoProducto])],
  controllers: [TipoProductoSubCategoriaController],
  providers: [TipoProductoSubCategoriaService],
})
export class TipoProductoSubCategoriaModule {}