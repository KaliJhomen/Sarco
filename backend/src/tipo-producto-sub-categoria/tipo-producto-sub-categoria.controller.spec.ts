import { Test, TestingModule } from '@nestjs/testing';
import { TipoProductoSubCategoriaController } from './tipo-producto-sub-categoria.controller';
import { TipoProductoSubCategoriaService } from './tipo-producto-sub-categoria.service';

describe('TipoProductoSubCategoriaController', () => {
  let controller: TipoProductoSubCategoriaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TipoProductoSubCategoriaController],
      providers: [TipoProductoSubCategoriaService],
    }).compile();

    controller = module.get<TipoProductoSubCategoriaController>(TipoProductoSubCategoriaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
