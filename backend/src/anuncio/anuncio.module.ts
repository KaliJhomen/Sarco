import { Module } from '@nestjs/common';
import { AnuncioService } from './anuncio.service';
import { AnuncioController } from './anuncio.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Anuncio } from './entities/anuncio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Anuncio])],
  controllers: [AnuncioController],
  providers: [AnuncioService],
})
export class AnuncioModule {}