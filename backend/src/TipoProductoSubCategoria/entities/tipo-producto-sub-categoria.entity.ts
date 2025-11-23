import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TipoProducto } from "src/tipo-producto/entities/tipo-producto.entity";
import { SubCategoria } from "src/sub-categoria/entities/sub-categoria.entity";

@Entity("tipo_producto_sub_categoria", { schema: "sarcos_db" })
export class TipoProductoSubCategoria {
    @PrimaryGeneratedColumn({ type: "int", name: "id_tipo_producto_sub_categoria" })
    idTipoProductoSubCategoria: number;
    @ManyToOne(() => TipoProducto, (tipoProducto) => tipoProducto.tipoProductoSubCategoria, {
        onDelete: "NO ACTION",
        onUpdate: "NO ACTION",
    })
    @JoinColumn({ name: "id_tipo_producto"})
    idTipoProducto: TipoProducto;

    @ManyToOne(() => SubCategoria, 
        sub => sub.tipoProductoSubCategoria, {
        onDelete: "NO ACTION",
        onUpdate: "NO ACTION",
    })
    @JoinColumn({ name: "id_sub_categoria"})
    idSubCategoria: SubCategoria;

}
