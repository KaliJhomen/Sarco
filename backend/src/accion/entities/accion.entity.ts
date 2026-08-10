import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RolPermiso } from "../../rol-permiso/entities/rol-permiso.entity";
import { UsuarioPermiso } from "../../usuario-permiso/entities/usuario-permiso.entity";

@Entity("accion", { schema: "sarcos_db" })
export class Accion {
  @PrimaryGeneratedColumn({ type: "int", name: "id_accion" })
  idAccion!: number;

  @Column("varchar", { name: "nombre", length: 50 })
  nombre!: string;

  @OneToMany(() => RolPermiso, (rolPermiso) => rolPermiso.accion)
  rolPermisos!: RolPermiso[];

  @OneToMany(() => UsuarioPermiso, (usuarioPermiso) => usuarioPermiso.accion)
  usuarioPermisos!: UsuarioPermiso[];
}
