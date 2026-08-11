import { Module } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { CategoriaController } from './categoria.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categoria } from './entities/categoria.entity';
import { SubCategoria } from '../sub-categoria/entities/sub-categoria.entity'; 

@Module({
  imports: [TypeOrmModule.forFeature([Categoria, SubCategoria])],
  controllers: [CategoriaController],
  providers: [CategoriaService],
})
export class CategoriaModule {}
