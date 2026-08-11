import { Test, TestingModule } from '@nestjs/testing';
import { TipoProductoSubCategoriaService } from './tipo-producto-sub-categoria.service';

describe('TipoProductoSubCategoriaService', () => {
  let service: TipoProductoSubCategoriaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TipoProductoSubCategoriaService],
    }).compile();

    service = module.get<TipoProductoSubCategoriaService>(TipoProductoSubCategoriaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
