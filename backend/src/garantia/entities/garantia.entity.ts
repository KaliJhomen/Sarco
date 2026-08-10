import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Producto } from "../../producto/entities/producto.entity";
import { Tienda } from "./../../tienda/entities/tienda.entity";
import { EstadoGarantia } from '../enums/estado-garantia.enum';


import { User } from "./../../user/entities/user.entity";
import { Cliente } from "./../../cliente/entities/cliente.entity";

@Index("FK_garantia_user", ["idUsuario"], {})
@Index("FK_garantia_cliente", ["idCliente"], {})
@Index("FK_garantia_producto", ["idProducto"], {})
@Index("FK_garantia_tienda", ["idTienda"], {})
@Entity("garantia", { schema: "sarcos_db" })
export class Garantia {
  @PrimaryGeneratedColumn({ type: "int", name: "id_garantia" })
  idGarantia!: number;

  @Column("int", { name: "id_usuario", nullable: true })
  idUsuario!: number | null;

  @Column("int", { name: "id_cliente", nullable: true })
  idCliente!: number | null;

  @Column("int", { name: "id_producto", nullable: true })
  idProducto!: number | null;

  @Column("int", { name: "id_tienda", nullable: true })
  idTienda!: number | null;

  @Column("text", { name: "descripcion", nullable: true })
  descripcion!: string | null;

  @Column("date", { name: "fecha_ingreso" })
  fechaIngreso!: string;

  @Column("date", { name: "fecha_devolucion", nullable: true })
  fechaDevolucion!: string | null;

  @Column("enum", {
    name: "estado",
    nullable: true,
    enum: EstadoGarantia,
    default: EstadoGarantia.PENDIENTE,  
  })
  estado!: EstadoGarantia | null;

  @OneToOne(() => Producto, (producto) => producto.garantia, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_producto", referencedColumnName: "idProducto" }])
  producto!: Producto;


  @ManyToOne(() => Cliente, (cliente) => cliente.garantias, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_cliente", referencedColumnName: "idCliente" }])
  cliente!: Cliente;

  @ManyToOne(() => Tienda, (tienda) => tienda.garantias, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_tienda", referencedColumnName: "idTienda" }])
  tienda!: Tienda;

  @ManyToOne(() => User, (user) => user.garantias, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_usuario", referencedColumnName: "idUser" }])
  user!: User;
}
