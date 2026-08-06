import { Test, TestingModule } from '@nestjs/testing';
import { FavoritosItemService } from './favoritos-item.service';
import { FavoritosService } from 'src/favoritos/favoritos.service';

describe('FavoritosItemService', () => {
  let service: FavoritosItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FavoritosItemService, FavoritosService],
    }).compile();

    service = module.get<FavoritosItemService>(FavoritosItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
