import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Producto } from 'src/producto/entities/producto.entity';

@Entity('favoritos')
export class Favoritos {
  @PrimaryGeneratedColumn({name: 'id_favoritos' })
  idFavoritos: number;

  @ManyToOne(() => User, (user) => user.favoritos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_user' })
  usuario: User;

  @ManyToOne(() => Producto, (producto) => producto.favoritos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_producto' })
  producto: Producto;
}