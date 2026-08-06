import { Test, TestingModule } from '@nestjs/testing';
import { PedidoDetalleService } from './pedido-detalle.service';

describe('PedidoDetalleService', () => {
  let service: PedidoDetalleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PedidoDetalleService],
    }).compile();

    service = module.get<PedidoDetalleService>(PedidoDetalleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
