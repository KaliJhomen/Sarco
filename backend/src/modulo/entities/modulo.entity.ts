import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RolPermiso } from "../../rol-permiso/entities/rol-permiso.entity";
import { UsuarioPermiso } from "../../usuario-permiso/entities/usuario-permiso.entity";

@Entity("modulo", { schema: "sarcos_db" })
export class Modulo {
  @PrimaryGeneratedColumn({ type: "int", name: "id_modulo" })
  idModulo!: number;

  @Column("varchar", { name: "nombre", length: 100 })
  nombre!: string;

  @Column("text", { name: "descripcion", nullable: true })
  descripcion!: string | null;

  @OneToMany(() => RolPermiso, (rolPermiso) => rolPermiso.modulo)
  rolPermisos!: RolPermiso[];

  @OneToMany(() => UsuarioPermiso, (usuarioPermiso) => usuarioPermiso.modulo)
  usuarioPermisos!: UsuarioPermiso[];
}
