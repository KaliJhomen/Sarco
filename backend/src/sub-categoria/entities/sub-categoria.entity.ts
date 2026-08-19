import { Categoria } from "src/categoria/entities/categoria.entity";
import { SubCategoriaTipoProducto } from "src/sub-categoria-tipo-producto/entities/sub-categoria-tipo-producto.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Index("fk_sub_categoria_categoria_1", ["idCategoria"], {})
@Entity("sub_categoria", { schema: "sarcos_db" })
export class SubCategoria {
    @PrimaryGeneratedColumn({ type: "int", name: "id_sub_categoria" })
    idSubCategoria!: number;

    @Column("varchar", { name: "nombre", length: 25 })
    nombre!: string | null;

    @Column("int", { name: "id_categoria" })
    idCategoria!: number;

    @Column("boolean", { name: "estado", default: 0})
    estado!: boolean;

    @ManyToOne(() => Categoria, (categoria) => categoria.subCategorias, {
        onDelete: "NO ACTION",
        onUpdate: "NO ACTION",
    })
    @JoinColumn([{ name: "id_categoria", referencedColumnName: "idCategoria" }])
    categoria!: Categoria;

    @OneToMany(() => SubCategoriaTipoProducto, (subCategoriaTipoProducto) => subCategoriaTipoProducto.subCategoria)
    subCategoriaTipoProductos!: SubCategoriaTipoProducto[];
}