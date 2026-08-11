import { Test, TestingModule } from '@nestjs/testing';
import { ProductoTiendaController } from './producto-tienda.controller';
import { ProductoTiendaService } from './producto-tienda.service';

describe('ProductoTiendaController', () => {
  let controller: ProductoTiendaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductoTiendaController],
      providers: [ProductoTiendaService],
    }).compile();

    controller = module.get<ProductoTiendaController>(ProductoTiendaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
