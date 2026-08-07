import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Tienda } from "../../tienda/entities/tienda.entity";
import { User } from "../../user/entities/user.entity";

@Index("fk_egreso_user", ["idUser"], {})
@Index("fk_egreso_tienda", ["idTienda"], {})
@Entity("egreso", { schema: "sarcos_db" })
export class Egreso {
  @PrimaryGeneratedColumn({ type: "int", name: "id_egreso" })
  idEgreso!: number;

  @Column("int", { name: "id_usuario", nullable: true })
  idUsuario!: number | null;

  @Column("int", { name: "id_tienda", nullable: true })
  idTienda!: number | null;

  @Column("varchar", { name: "nombre", nullable: true, length: 255 })
  nombre!: string | null;

  @Column("varchar", { name: "descripcion", nullable: true, length: 255 })
  descripcion!: string | null;

  @Column("decimal", {
    name: "monto_egreso",
    nullable: true,
    precision: 20,
    scale: 2,
  })
  montoEgreso!: number | null;

  @Column("date", { name: "fecha", nullable: true })
  fecha!: Date | null;

  @Column("varchar", { name: "estado", nullable: true, length: 50 })
  estado!: string | null;

  @ManyToOne(() => Tienda, (tienda) => tienda.egresos, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_tienda", referencedColumnName: "idTienda" }])
  tienda!: Tienda;

  @ManyToOne(() => User, (user) => user.egresos, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "id_user", referencedColumnName: "idUser" }])
  user!: User;
}
