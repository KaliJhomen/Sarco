import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn, OneToMany, OneToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { FavoritosItem } from './favoritos-item.entity';
import { Producto } from 'src/producto/entities/producto.entity';

@Entity('favoritos')
export class Favoritos {
  @PrimaryGeneratedColumn({ name: 'id_favoritos' })
  idFavoritos!: number;

  @Column("varchar",{ 
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
  
  //ITEMS
  @OneToMany(() => FavoritosItem, (item) => item.favoritos, { cascade: true })
  items!: FavoritosItem[];
  //
  
  @OneToOne(() => Usuario, (usuario) => usuario.favoritos, { 
    nullable: true, 
    onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_usuario' })
  usuario?: Usuario;

  @ManyToOne(() => Producto
, (producto) => producto.favoritosItems, { 
    onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_producto' })
  producto!: Producto;
}