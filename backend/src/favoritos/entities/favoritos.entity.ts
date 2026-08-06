import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Cliente } from 'src/cliente/entities/cliente.entity';
import { FavoritosItem } from 'src/favoritos-item/entities/favoritos-item.entity';

@Entity('favoritos')
export class Favoritos {
  @PrimaryGeneratedColumn({
    name: 'id_favoritos' })
  idFavoritos: number;

  @ManyToOne(() => Cliente,{ nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ 
    name: 'id_cliente' })
  cliente?: Cliente;
  //ITEMS
  @OneToMany(() => FavoritosItem, (item) => item.favoritos, { cascade: true })
  items: FavoritosItem[];
  //
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
  expiresAt: Date | null;
    
  @CreateDateColumn({name: 'created_at'})
  createdAt: Date;

  @UpdateDateColumn({name: 'updated_at'})
  updatedAt: Date;

/*
  @ManyToOne(() => Favoritos, favoritos => favoritos.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_favoritos' })
  favoritos: Favoritos;
  @ManyToOne(() => Producto)
  @JoinColumn({ name: 'id_producto' })
  producto: Producto;
*/
}