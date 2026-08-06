import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Config } from './entities/config.entity';
import { CreateConfigDto } from './dto/create-config.dto';
import { UpdateConfigDto } from './dto/update-config.dto';

@Injectable()
export class ConfigService {

  constructor(
    @InjectRepository(Config)
    private configRepo: Repository<Config>,
  ) {}

  create(dto: CreateConfigDto) {
    const config = this.configRepo.create(dto);
    return this.configRepo.save(config);
  }

  findAll() {
    return this.configRepo.find();
  }

  async findOne(nombre: string) {
    const config = await this.configRepo.findOne({ where: { nombre } });

    if (!config) {
      throw new NotFoundException(`Config "${nombre}" no encontrado`);
    }

    return config;
  }

  async update(nombre: string, dto: UpdateConfigDto) {
    const config = await this.findOne(nombre);

    Object.assign(config, dto);

    return this.configRepo.save(config);
  }

  async remove(nombre: string) {
    const config = await this.findOne(nombre);
    return this.configRepo.remove(config);
  }
}