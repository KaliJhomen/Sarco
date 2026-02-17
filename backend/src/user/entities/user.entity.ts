import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne, OneToMany } from 'typeorm';
import { Carrito } from '../../carrito/entities/carrito.entity';
import { Favoritos } from '../../favoritos/entities/favoritos.entity';

@Entity('user') 
export class User {
  @PrimaryGeneratedColumn({ name: 'id_user' })
  idUser: number;

  @Column()
  nombre: string;

  @Column({ unique: true })
  email: string;

  @Column()
  clave: string;

  @Column()
  rol: string;
  
  @OneToOne(() => Carrito, (carrito) => carrito.user)
  carrito: Carrito;

  @OneToMany(() => Favoritos, (favoritos) => favoritos.usuario)
  favoritos: Favoritos[];
}