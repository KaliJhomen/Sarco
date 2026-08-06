import { Test, TestingModule } from '@nestjs/testing';
import { PedidoDetalleController} from './pedido-detalle.controller';
import { PedidoDetalleService } from './pedido-detalle.service';

describe('PedidoDetalleController', () => {
  let controller: PedidoDetalleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PedidoDetalleController],
      providers: [PedidoDetalleService],
    }).compile();

    controller = module.get<PedidoDetalleController>(PedidoDetalleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
