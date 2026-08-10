import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Credito } from "../../credito/entities/credito.entity";

@Entity("estado_credito", { schema: "sarcos_db" })
export class EstadoCredito {
  @PrimaryGeneratedColumn({ type: "int", name: "id_estado_credito" })
  idEstadoCredito!: number;

  @Column("varchar", { name: "nombre", nullable: true, length: 50 })
  nombre!: string | null;

  @OneToMany(() => Credito, (credito) => credito.estadoCredito)
  creditos!: Credito[];
}
