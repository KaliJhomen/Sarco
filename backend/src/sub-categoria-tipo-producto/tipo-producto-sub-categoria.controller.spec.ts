import { Test, TestingModule } from '@nestjs/testing';
import { TipoProductoSubCategoriaController } from './sub-categoria-tipo-producto.controller';
import { TipoProductoSubCategoriaService } from './sub-categoria-tipo-producto.service';

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
