import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Cliente } from "../../cliente/entities/cliente.entity";

@Entity("estado_cliente", { schema: "sarcos_db" })
export class EstadoCliente {
  @PrimaryGeneratedColumn({ type: "int", name: "id_estado" })
  idEstado!: number;

  @Column("varchar", { name: "nombre", nullable: true, length: 50 })
  nombre!: string | null;

  @OneToMany(() => Cliente, (cliente) => cliente.estadoCliente)
  clientes!: Cliente[];
}
