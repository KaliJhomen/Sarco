import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";



@Entity("metodo_pago", { schema: "sarcos_db" })
export class MetodoPago {
  @PrimaryGeneratedColumn({ type: "int", name: "id_metodo_pago" })
  idMetodoPago!: number;

  @Column("varchar", { name: "nombre", nullable: true, length: 255 })
  nombre!: string | null;

}
