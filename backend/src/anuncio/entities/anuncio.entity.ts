// backend/src/anuncio/entities/anuncio.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('anuncio', {schema: 'sarcos_db'})
export class Anuncio {
  @PrimaryGeneratedColumn()
  idAnuncio: number;

  @Column('varchar', { length: 255 })
  titulo: string;

  @Column('varchar', { length: 500 })
  imagen: string; 
  @Column('varchar', { length: 255, nullable: true })
  urlDestino: string;

  @Column('int', { default: 0 })
  orden: number; 

  @Column('boolean', { default: true })
  estado: boolean;

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  fechaCreacion: Date;

  @Column('datetime', { nullable: true })
  fechaModificacion: Date;
}