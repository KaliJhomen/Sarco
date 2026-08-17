import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("comprobante", { schema: "sarcos_db" })
export class Comprobante {
  @PrimaryGeneratedColumn({ type: "int", name: "id_comprobante" })
  idComprobante!: number;

  @Column("varchar", { name: "nombre", nullable: true, length: 255 })
  nombre!: string | null;
}
