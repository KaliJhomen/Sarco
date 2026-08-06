import { Test, TestingModule } from '@nestjs/testing';
import { AccionController } from './anuncio.controller';
import { AccionService } from './anuncio.service';

describe('AccionController', () => {
  let controller: AccionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccionController],
      providers: [AccionService],
    }).compile();

    controller = module.get<AccionController>(AccionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
