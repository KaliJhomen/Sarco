import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RolPermiso } from "../../rol-permiso/entities/rol-permiso.entity";

@Entity("rol", { schema: "sarcos_db" })
export class Rol {
  @PrimaryGeneratedColumn({ type: "int", name: "id_rol" })
  idRol!: number;

  @Column("varchar", { name: "nombre", length: 100 })
  nombre!: string;

  @OneToMany(() => RolPermiso, (rolPermiso) => rolPermiso.rol)
  permisos!: RolPermiso[];
}
