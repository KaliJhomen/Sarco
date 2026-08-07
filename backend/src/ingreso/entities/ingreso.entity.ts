import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { MetodoPago } from "../../metodo-pago/entities/metodo-pago.entity";
import { Tienda } from "../../tienda/entities/tienda.entity";
import { Usuario } from "./../../usuario/entities/usuario.entity";
import { User } from "src/user/entities/user.entity";

@Index("fk_ingreso_usuario_1", ["idUsuario"], {})
@Index("fk_ingreso_metodo_pago_2", ["idMetodoPago"], {})
@Index("fk_ingreso_tienda", ["idTienda"], {})
@Entity("ingreso", { schema: "sarcos_db" })
export class Ingreso {
  @PrimaryGeneratedColumn({ type: "int", name: "id_ingreso" })
  idIngreso!: number;

  @Column("int", { name: "id_usuario", nullable: true })
  idUsuario!: number | null;

  @Column("int", { name: "id_tienda", nullable: true })
  idTienda!: number | null;

  @Column("varchar", { name: "tipo_ingreso", nullable: true, length: 255 })
  tipoIngreso!: string | null;

  @Column("decimal", {
    name: "monto_ingreso",
    nullable: true,
    precision: 20,
    scale: 2,
  })
  montoIngreso!: string | null;

  @Column("int", { name: "id_metodo_pago", nullable: true })
  idMetodoPago!: number | null;

  @Column("datetime", { name: "fecha_hora", nullable: true })
  fechaHora!: Date | null;

  @Column("varchar", { name: "numero_comprobante", nullable: true, length: 50 })
  numeroComprobante!: string | null;

  @Column("varchar", { name: "estado", nullable: true, length: 50 })
  estado!: string | null;

  
  @ManyToOne(() => MetodoPago, (metodoPago) => metodoPago.ingresos, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_metodo_pago", referencedColumnName: "idMetodoPago" }])
  metodoPago!: MetodoPago;

  @ManyToOne(() => Tienda, (tienda) => tienda.ingresos, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_tienda", referencedColumnName: "idTienda" }])
  tienda!: Tienda;

  @ManyToOne(() => User, (user) => user.ingresos, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_usuario", referencedColumnName: "idUser" }])
  user!: User;
}
