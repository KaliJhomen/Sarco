import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn } from 'typeorm';

@Entity('anuncio', {schema: 'sarcos_db'})
export class Anuncio {
  @PrimaryGeneratedColumn({name: 'id_anuncio'})
  idAnuncio!: number;

  @Column("varchar", { length: 255 })
  titulo!: string;

  @Column("varchar", { length: 500 })
  imagen!: string; 
  @Column("varchar", { name: 'url_destino', length: 255, nullable: true })
  urlDestino!: string;

  @Column("int")
  orden!: number; 

  @Column("boolean", { default: true })
  estado!: boolean;

  @CreateDateColumn({name: 'created_at', type: 'timestamp'})
  createdAt!: Date;
  
  @UpdateDateColumn({name: 'updated_at', type: 'timestamp'})
  updatedAt!: Date;
}