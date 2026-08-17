import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductoTienda } from "../../producto-tienda/entities/producto-tienda.entity";
import { Garantia } from "../../garantia/entities/garantia.entity";
import { User } from "src/user/entities/user.entity";

@Entity("tienda", { schema: "sarcos_db" })
export class Tienda {
  @PrimaryGeneratedColumn({ type: "int", name: "id_tienda" })
  idTienda!: number;

  @Column("varchar", { name: "nombre", length: 250 })
  nombre!: string;

  @Column("varchar", { name: "direccion", length: 250 })
  direccion!: string;

  @Column("bigint", { name: "condicion", nullable: true })
  condicion!: string | null;



  @OneToMany(() => User, (user) => user.idTienda)
  user!: User[];

  
  @OneToMany(() => ProductoTienda, (productoTienda) => productoTienda.idTienda)
  productoTiendas!: ProductoTienda[];

  @OneToMany(() => Garantia, (garantia) => garantia.idTienda)
  garantias!: Garantia[];
}