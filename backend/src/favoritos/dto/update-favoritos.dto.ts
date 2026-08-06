import { PartialType } from '@nestjs/swagger';
import { CreateFavoritosDto } from './create-favoritos.dto';

export class UpdateFavoritosDto extends PartialType(CreateFavoritosDto) {}
