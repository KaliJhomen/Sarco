import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
// import { ArticuloTienda } from "../../articulo-tienda/entities/articulo-tienda.entity";
import { ProductoTienda } from "../../producto-tienda/entities/producto-tienda.entity";
import { Credito } from "../../credito/entities/credito.entity";
import { Egreso } from "../../egreso/entities/egreso.entity";
import { Garantia } from "../../garantia/entities/garantia.entity";
import { Ingreso } from "../../ingreso/entities/ingreso.entity";
import { PagoCredito } from "../../pago-credito/entities/pago-credito.entity";
import { PagoSeparado } from "../../pago-separado/entities/pago-separado.entity";
import { Separado } from "../../separado/entities/separado.entity";
import { TicketCredito } from "../../ticket-credito/entities/ticket-credito.entity";
import { Usuario } from "../../usuario/entities/usuario.entity";
import { Venta } from "../../venta/entities/venta.entity";

@Entity("tienda", { schema: "sarcos_db" })
export class Tienda {
  @PrimaryGeneratedColumn({ type: "int", name: "id_tienda" })
  idTienda: number;

  @Column("varchar", { name: "nombre", length: 250 })
  nombre: string;

  @Column("varchar", { name: "direccion", length: 250 })
  direccion: string;

  @Column("bigint", { name: "condicion", nullable: true })
  condicion: string | null;
  

  @OneToMany(() => ProductoTienda, (productoTienda) => productoTienda.idTienda2)
  productoTiendas: ProductoTienda[];

  @OneToMany(() => Credito, (credito) => credito.idTienda2)
  creditos: Credito[];

  @OneToMany(() => Egreso, (egreso) => egreso.idTienda2)
  egresos: Egreso[];

  @OneToMany(() => Garantia, (garantia) => garantia.idTienda2)
  garantias: Garantia[];

  @OneToMany(() => Ingreso, (ingreso) => ingreso.idTienda2)
  ingresos: Ingreso[];

  @OneToMany(() => PagoCredito, (pagoCredito) => pagoCredito.idTienda2)
  pagoCreditos: PagoCredito[];

  @OneToMany(() => PagoSeparado, (pagoSeparado) => pagoSeparado.idTienda2)
  pagoSeparados: PagoSeparado[];

  @OneToMany(() => Separado, (separado) => separado.idTienda2)
  separados: Separado[];

  @OneToMany(() => TicketCredito, (ticketCredito) => ticketCredito.idTienda2)
  ticketCreditos: TicketCredito[];

  @OneToMany(() => Usuario, (usuario) => usuario.idTienda2)
  usuarios: Usuario[];

  @OneToMany(() => Venta, (venta) => venta.idTienda2)
  ventas: Venta[];
}
