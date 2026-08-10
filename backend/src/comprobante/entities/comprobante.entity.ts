import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Credito } from "../../credito/entities/credito.entity";
import { Separado } from "../../separado/entities/separado.entity";
import { Servicio } from "../../servicio/entities/servicio.entity";
import { Venta } from "../../venta/entities/venta.entity";

@Entity("comprobante", { schema: "sarcos_db" })
export class Comprobante {
  @PrimaryGeneratedColumn({ type: "int", name: "id_comprobante" })
  idComprobante!: number;

  @Column("varchar", { name: "nombre", nullable: true, length: 255 })
  nombre!: string | null;

  @OneToMany(() => Credito, (credito) => credito.comprobante)
  creditos!: Credito[];

  @OneToMany(() => Separado, (separado) => separado.comprobante)
  separados!: Separado[];

  @OneToMany(() => Servicio, (servicio) => servicio.comprobante)
  servicios!: Servicio[];

  @OneToMany(() => Venta, (venta) => venta.comprobante)
  ventas!: Venta[];
}
