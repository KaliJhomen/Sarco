import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('config')
export class Config {

  @PrimaryGeneratedColumn()
  key!: number;

  @Column({ unique: true, length: 100 })
  nombre!: string;

  @Column({ type: 'text' })
  valor!: string;

  @Column({ length: 255, nullable: true })
  descripcion!: string;

  @CreateDateColumn({name: 'created_at'})
  createdAt!: Date;

  @UpdateDateColumn({name: 'updated_at'})
  updatedAt!: Date;
}


