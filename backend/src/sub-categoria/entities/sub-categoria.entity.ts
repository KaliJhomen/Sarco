import { Categoria } from "src/categoria/entities/categoria.entity";
import { TipoProductoSubCategoria } from "src/TipoProductoSubCategoria/entities/tipo-producto-sub-categoria.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Index("fk_sub_categoria_categoria_1", ["idCategoria"], {})
@Entity("sub_categoria", { schema: "sarcos_db" })
export class SubCategoria {
    @PrimaryGeneratedColumn({ type: "int", name: "id_sub_categoria" })
    idSubCategoria: number;

    @Column("varchar", { name: "nombre", nullable: true, length: 25 })
    nombre: string | null;

    @Column("int", { name: "id_categoria", nullable: true })
    idCategoria: number | null;

    @Column("boolean", { name: "estado", default: () => "'1'" })
    estado: boolean | null;

    @ManyToOne(() => Categoria, (categoria) => categoria.subCategorias, {
        onDelete: "NO ACTION",
        onUpdate: "NO ACTION",
    })
    
    @JoinColumn([{ name: "id_categoria", referencedColumnName: "idCategoria" }])
    idCategoria2: Categoria;

    @OneToMany(() => TipoProductoSubCategoria, (tipoProductoSubCategoria) => tipoProductoSubCategoria.idSubCategoria)
    tipoProductoSubCategoria: TipoProductoSubCategoria[];
}