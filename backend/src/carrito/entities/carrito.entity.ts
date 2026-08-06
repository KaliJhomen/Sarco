import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { CarritoItem } from '../../carrito-item/entities/carrito-item.entity';

@Entity('carrito')
export class Carrito {
  @PrimaryGeneratedColumn({ name: 'id_carrito' })
  idCart!: number;

  @ManyToOne(() => Usuario, { nullable: true, onDelete:'CASCADE' })
  @JoinColumn({ name: 'id_usuario' })
  user?: Usuario;

    //ITEMS
  @OneToMany(() => CarritoItem, (item) => item.cart, {cascade: true})
  items!: CarritoItem[];

  @Column({ 
    name: 'session_token', 
    type: 'varchar', 
    length: 36, 
    nullable: true, 
    unique: true })
  sessionToken?: string | null;

  @Column({
    name: 'share_token',
    type: 'varchar',
    length: 36,
    nullable: true, 
    unique: true})
  shareToken?: string | null;
  
  @Column({
    name: 'expires_at',
    type: 'timestamp',
    nullable: true,})
  expiresAt!: Date | null;
    
  @CreateDateColumn({name: 'created_at'})
  createdAt!: Date;

  @UpdateDateColumn({name: 'updated_at'})
  updatedAt!: Date;
}