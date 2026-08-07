import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Cliente } from "../../cliente/entities/cliente.entity";
import { Usuario } from "../../usuario/entities/usuario.entity";
import { User } from "../../user/entities/user.entity";

@Entity("documento", { schema: "sarcos_db" })
export class Documento {
  @PrimaryGeneratedColumn({ type: "int", name: "id_documento" })
  idDocumento!: number;

  @Column("varchar", { name: "nombre", nullable: true, length: 50 })
  nombre!: string | null;


  @OneToMany(() => Cliente, (cliente) => cliente.documento)
  clientes!: Cliente[];

  @OneToMany(() => User, (user) => user.documento)
  users!: User[];

  @OneToMany(() => Usuario, (usuario) => usuario.documento)
  usuarios!: Usuario[];
}
