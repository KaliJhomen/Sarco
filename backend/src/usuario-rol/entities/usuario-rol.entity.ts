import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from "typeorm";
import { Usuario } from "../../usuario/entities/usuario.entity";
import { Rol } from "../../rol/entities/rol.entity";

@Entity("usuario_rol", { schema: "sarcos_db" })
export class UsuarioRol {
  @PrimaryColumn({ type: "int", name: "id_usuario" })
  idUsuario!: number;

  @PrimaryColumn({ type: "int", name: "id_rol" })
  idRol!: number;

  /*
  @ManyToOne(() => Usuario, (usuario) => usuario.roles, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "id_usuario", referencedColumnName: "idUsuario" }])
  user!: Usuario;
  */
  @ManyToOne(() => Rol, (rol) => rol.usuarios, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "id_rol", referencedColumnName: "idRol" }])
  role!: Rol;
}
