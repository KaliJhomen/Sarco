import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Producto } from '../../producto/entities/producto.entity';
import { Favoritos } from '../../favoritos/entities/favoritos.entity';

@Entity('favoritos_item')
@Unique('uq_favoritos_producto', ['favoritos', 'producto'])
export class FavoritosItem {
  @PrimaryGeneratedColumn({ name: 'id_favoritos_item' })
  idFavoritosItem!: number;

  @ManyToOne(() => Favoritos, (favoritos) => favoritos.items, { 
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'id_favoritos_item_favoritos' })
  favoritos!: Favoritos;

  @ManyToOne(() => Producto, (producto) => producto.favoritosItems, { 
    onDelete: 'CASCADE', 
    onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'id_favoritos_item_producto' })
  producto!: Producto;
}