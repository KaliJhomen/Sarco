import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Venta } from "../../venta/entities/venta.entity";

@Entity("estado_venta", { schema: "sarcos_db" })
export class EstadoVenta {
  @PrimaryGeneratedColumn({ type: "int", name: "id_estado_venta" })
  idEstadoVenta!: number;

  @Column("varchar", { name: "nombre", nullable: true, length: 50 })
  nombre!: string | null;

  @OneToMany(() => Venta, (venta) => venta.estadoVenta)
  ventas!: Venta[];
}
