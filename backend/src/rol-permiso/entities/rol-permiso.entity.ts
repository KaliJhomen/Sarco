import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Rol } from "../../rol/entities/rol.entity";
import { Modulo } from "../../modulo/entities/modulo.entity";
import { Accion } from "../../accion/entities/accion.entity";

@Index("fk_rol_permiso_modulo_1", ["idModulo"], {})
@Index("fk_rol_permiso_rol_2", ["idRol"], {})
@Index("fk_rol_permiso_accion_3", ["idAccion"], {})

@Entity("rol_permiso", { schema: "sarcos_db" })
export class RolPermiso {
    @PrimaryGeneratedColumn({ type: "int", name: "id_rol_permiso" })
    idRolPermiso!: number;

    @Column("int", { name: "id_rol", nullable: true })
    idRol!: number;

    @Column("int", { name: "id_modulo", nullable: true })
    idModulo!: number;

    @Column("int", { name: "id_accion", nullable: true })
    idAccion!: number;


    @Column("boolean", { name: "permitido", default: () => "true" })
    permitido!: boolean;

    @ManyToOne(() => Rol, (rol) => rol.permisos, { onDelete: "CASCADE" })
    @JoinColumn({ name: "id_rol", referencedColumnName: "idRol" })
    rol!: Rol;

    @ManyToOne(() => Modulo, (modulo) => modulo.rolPermisos, { onDelete: "CASCADE" })
    @JoinColumn({ name: "id_modulo", referencedColumnName: "idModulo" })
    modulo!: Modulo;

    @ManyToOne(() => Accion, (accion) => accion.rolPermisos, { onDelete: "CASCADE" })
    @JoinColumn({ name: "id_accion", referencedColumnName: "idAccion" })
    accion!: Accion;
}
