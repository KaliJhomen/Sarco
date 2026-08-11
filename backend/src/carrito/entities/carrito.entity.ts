import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { CarritoItem } from './carrito-item.entity';

@Entity('carrito')
export class Carrito {
  @PrimaryGeneratedColumn({ name: 'id_carrito' })
  idCarrito!: number;

  @Column( "varchar", { 
    name: 'session_token', 
    length: 36, 
    nullable: true, 
    unique: true })
  sessionToken!: string | null;

  @Column( "varchar", {
    name: 'share_token',
    length: 36,
    nullable: true, 
    unique: true})
  shareToken!: string | null;
  
  @Column( "timestamp",{
    name: 'expires_at',
    nullable: true,})
  expiresAt!: Date | null;
    
  @CreateDateColumn({name: 'created_at'})
  createdAt!: Date;

  @UpdateDateColumn({name: 'updated_at'})
  updatedAt!: Date;

  @OneToOne(() => Usuario, (usuario) => usuario.carrito, { 
    nullable: true, 
    onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_usuario' })
  usuario?: Usuario | null;

    //ITEMS
  @OneToMany(() => CarritoItem, (item) => item.carrito, {cascade: true})
  items!: CarritoItem[];
}