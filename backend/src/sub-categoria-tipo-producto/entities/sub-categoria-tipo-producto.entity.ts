import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TipoProducto } from "src/tipo-producto/entities/tipo-producto.entity";
import { SubCategoria } from "src/sub-categoria/entities/sub-categoria.entity";

@Entity("sub_categoria_tipo_producto", { schema: "sarcos_db" })
export class SubCategoriaTipoProducto {
    @PrimaryGeneratedColumn({ type: "int", name: "id_sub_categoria_tipo_producto" })
    idSubCategoriaTipoProducto!: number;


    @ManyToOne(() => TipoProducto, (tipoProducto) => tipoProducto.subCategoriaTipoProductos, {
    nullable: true,
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
    })
    @JoinColumn({ name: "id_tipo_producto"})
    tipoProducto!: TipoProducto | null;

    @ManyToOne(() => SubCategoria, (subCategoria) => subCategoria.subCategoriaTipoProductos, {
        nullable: true,
        onDelete: "NO ACTION",
        onUpdate: "NO ACTION",  
    })
    @JoinColumn({ name: "id_sub_categoria"})
    subCategoria!: SubCategoria | null;

}
