import { PartialType } from '@nestjs/swagger';
import { CreateFavoritosItemDto } from './create-favoritos-item.dto';

export class UpdateFavoritosItemDto extends PartialType(CreateFavoritosItemDto) {}
