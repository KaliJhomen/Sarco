import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PagoSeparado } from "../../pago-separado/entities/pago-separado.entity";
import { Separado } from "../../separado/entities/separado.entity";


@Entity("metodo_pago", { schema: "sarcos_db" })
export class MetodoPago {
  @PrimaryGeneratedColumn({ type: "int", name: "id_metodo_pago" })
  idMetodoPago!: number;

  @Column("varchar", { name: "nombre", nullable: true, length: 255 })
  nombre!: string | null;

  @OneToMany(() => PagoSeparado, (pagoSeparado) => pagoSeparado.metodoPago)
  pagoSeparados!: PagoSeparado[];

  @OneToMany(() => Separado, (separado) => separado.metodoPago)
  separados!: Separado[];
}
