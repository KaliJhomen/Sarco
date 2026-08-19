import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Producto } from "src/producto/entities/producto.entity";

@Entity("marca", { schema: "sarcos_db" })
export class Marca {
  @PrimaryGeneratedColumn({ type: "int", name: "id_marca" })
  idMarca!: number;

  @Column("varchar", { name: "nombre", length: 20 })
  nombre!: string;

  @Column("boolean", { name: "estado", default: '1'})
  estado!: boolean;

  @OneToMany(() => Producto, (producto) => producto.marca)
  productos!: Producto[];
}
