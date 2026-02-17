import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAnuncioDto } from './dto/create-anuncio.dto';
import { UpdateAnuncioDto } from './dto/update-anuncio.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Anuncio } from './entities/anuncio.entity';

@Injectable()
export class AnuncioService {
  constructor(
    @InjectRepository(Anuncio)
    private anuncioRepository: Repository<Anuncio>,
  ) { }

  async create(createAnuncioDto: CreateAnuncioDto) {
    const anuncio = this.anuncioRepository.create(createAnuncioDto);
    return await this.anuncioRepository.save(anuncio);
  }

  async getAnuncios() {
    return await this.anuncioRepository.find({
      where: { estado: true },
      order: { orden: 'ASC' },
    });
  }

  async findOne(id: number) {
    const anuncio = await this.anuncioRepository.findOne({
      where: { idAnuncio: id },
    });
    
    if (!anuncio) {
      throw new NotFoundException(`Anuncio con ID ${id} no encontrado`);
    }
    
    return anuncio;
  }

  async update(id: number, updateAnuncioDto: UpdateAnuncioDto) {
    const anuncio = await this.findOne(id);
    
    Object.assign(anuncio, updateAnuncioDto);
    anuncio.fechaModificacion = new Date();
    
    return await this.anuncioRepository.save(anuncio);
  }

  async remove(id: number) {
    const anuncio = await this.findOne(id);
    await this.anuncioRepository.remove(anuncio);
    return { message: `Anuncio con ID ${id} eliminado exitosamente` };
  }
}
