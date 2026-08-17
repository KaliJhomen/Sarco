import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("permiso", { schema: "sarcos_db" })
export class Permiso {
  @PrimaryGeneratedColumn({ type: "int", name: "id_permiso" })
  idPermiso!: number;

  @Column("varchar", { name: "nombre", nullable: true, length: 255 })
  nombre!: string | null;

  // @OneToMany(
  //   () => UsuarioPermiso,
  //   (usuarioPermiso) => usuarioPermiso.idPermiso2
  // )
}
