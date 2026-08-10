import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from "typeorm";
import { Usuario } from "../../usuario/entities/usuario.entity";
import { Rol } from "../../rol/entities/rol.entity";
import { User } from "src/user/entities/user.entity";

@Entity("usuario_rol", { schema: "sarcos_db" })
export class UsuarioRol {
  @PrimaryColumn({ type: "int", name: "id_usuario" })
  idUsuario!: number;

  @PrimaryColumn({ type: "int", name: "id_rol" })
  idRol!: number;

  
  @ManyToOne(() => User, (user) => user.usuarioRoles, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "id_usuario", referencedColumnName: "idUser" }])
  user!: User;
  
  @ManyToOne(() => Rol, (rol) => rol.usuarioRoles, {
    onDelete: "CASCADE",
  })
  @JoinColumn([{ name: "id_rol", referencedColumnName: "idRol" }])
  rol!: Rol;
}
