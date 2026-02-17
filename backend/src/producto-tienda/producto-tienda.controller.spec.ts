import { Test, TestingModule } from '@nestjs/testing';
import { ProductoTiendaProductoController } from './producto-tienda-producto.controller';
import { ProductoTiendaProductoService } from './producto-tienda-producto.service';

describe('ProductoTiendaProductoController', () => {
  let controller: ProductoTiendaProductoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductoTiendaProductoController],
      providers: [ProductoTiendaProductoService],
    }).compile();

    controller = module.get<ProductoTiendaProductoController>(ProductoTiendaProductoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
