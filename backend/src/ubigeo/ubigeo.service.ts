import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ubigeo } from './entities/ubigeo.entity';

export interface UbigeoItem {
  codigo: string;
  nombre: string;
}

@Injectable()
export class UbigeoService {
  constructor(
    @InjectRepository(Ubigeo)
    private readonly ubigeoRepository: Repository<Ubigeo>,
  ) {}

  async getDepartamentos(): Promise<UbigeoItem[]> {
    return this.ubigeoRepository.query(
      'SELECT DISTINCT LEFT(codigo, 2) AS codigo, departamento AS nombre FROM ubigeo ORDER BY nombre ASC',
    );
  }

  async getProvincias(codigo: string): Promise<UbigeoItem[]> {
    const prefix = this.prefix(codigo, 2);
    if (!prefix) return [];
    return this.ubigeoRepository.query(
      'SELECT DISTINCT LEFT(codigo, 4) AS codigo, provincia AS nombre FROM ubigeo WHERE codigo LIKE ? ORDER BY nombre ASC',
      [prefix],
    );
  }

  async getDistritos(codigo: string): Promise<UbigeoItem[]> {
    const prefix = this.prefix(codigo, 4);
    if (!prefix) return [];
    return this.ubigeoRepository.query(
      'SELECT codigo, distrito AS nombre FROM ubigeo WHERE codigo LIKE ? ORDER BY nombre ASC',
      [prefix],
    );
  }

  private prefix(codigo: string, len: number): string | null {
    const digits = codigo.replace(/\D/g, '').slice(0, len);
    return digits.length > 0 ? `${digits}%` : null;
  }
}