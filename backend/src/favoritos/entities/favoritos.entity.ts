import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Producto } from 'src/producto/entities/producto.entity';

@Entity('favoritos')
export class Favoritos {
  @PrimaryGeneratedColumn({name: 'id_favoritos' })
  idFavoritos: number;

  @Column( {name: 'id_user' })
  idUser: number;

  @Column( {name: 'id_producto' })
  idProducto: number;

  @ManyToOne(() => User, (user) => user.favoritos, { onDelete: 'CASCADE' })
  usuario: User;

  @ManyToOne(() => Producto, (producto) => producto.favoritos, { onDelete: 'CASCADE' })
  producto: Producto;
}