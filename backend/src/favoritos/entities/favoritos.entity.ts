import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn, OneToMany, OneToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Cliente } from '../../cliente/entities/cliente.entity';
import { FavoritosItem } from './favoritos-item.entity';

@Entity('favoritos')
export class Favoritos {
  @PrimaryGeneratedColumn({ name: 'id_favoritos' })
  idFavoritos!: number;

  @Column("varchar",{ 
    name: 'session_token', 
    length: 36, 
    nullable: true })
  sessionToken!: string | null;

  @Column( "varchar", {
    name: 'share_token',
    length: 36,
    nullable: true })
  shareToken!: string | null;
  
  @Column( "timestamp",{
    name: 'expires_at',
    nullable: true,})
  expiresAt!: Date | null;
    
  @CreateDateColumn({name: 'created_at'})
  createdAt!: Date;

  @UpdateDateColumn({name: 'updated_at', nullable: true, default: null})
  updatedAt!: Date | null;
  
  //ITEMS
  @OneToMany(() => FavoritosItem, (item) => item.favoritos, { cascade: true })
  items!: FavoritosItem[];
  //
  
  @OneToOne(() => Cliente, (cliente) => cliente.favoritos, {  
    onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_cliente' })
  cliente!: Cliente;
}