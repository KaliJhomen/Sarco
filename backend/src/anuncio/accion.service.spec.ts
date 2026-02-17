import { Test, TestingModule } from '@nestjs/testing';
import { AccionService } from './anuncio.service';

describe('AccionService', () => {
  let service: AccionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccionService],
    }).compile();

    service = module.get<AccionService>(AccionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
