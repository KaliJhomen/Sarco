import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductoTienda } from "../../producto-tienda/entities/producto-tienda.entity";
import { Credito } from "../../credito/entities/credito.entity";
import { Egreso } from "../../egreso/entities/egreso.entity";
import { Garantia } from "../../garantia/entities/garantia.entity";
import { Ingreso } from "../../ingreso/entities/ingreso.entity";
import { PagoCredito } from "../../pago-credito/entities/pago-credito.entity";
import { PagoSeparado } from "../../pago-separado/entities/pago-separado.entity";
import { Separado } from "../../separado/entities/separado.entity";
import { TicketCredito } from "../../ticket-credito/entities/ticket-credito.entity";
import { Venta } from "../../venta/entities/venta.entity";
import { User } from "src/user/entities/user.entity";

@Entity("tienda", { schema: "sarcos_db" })
export class Tienda {
  @PrimaryGeneratedColumn({ type: "int", name: "id_tienda" })
  idTienda!: number;

  @Column("varchar", { name: "nombre", length: 250 })
  nombre!: string;

  @Column("varchar", { name: "direccion", length: 250 })
  direccion!: string;

  @Column("bigint", { name: "condicion", nullable: true })
  condicion!: string | null;



  @OneToMany(() => User, (user) => user.idTienda)
  user!: User[];

  
  @OneToMany(() => ProductoTienda, (productoTienda) => productoTienda.idTienda)
  productoTiendas!: ProductoTienda[];

  @OneToMany(() => Credito, (credito) => credito.idTienda)
  creditos!: Credito[];

  @OneToMany(() => Egreso, (egreso) => egreso.idTienda)
  egresos!: Egreso[];

  @OneToMany(() => Garantia, (garantia) => garantia.idTienda)
  garantias!: Garantia[];

  @OneToMany(() => Ingreso, (ingreso) => ingreso.idTienda)
  ingresos!: Ingreso[];

  @OneToMany(() => PagoCredito, (pagoCredito) => pagoCredito.idTienda)
  pagoCreditos!: PagoCredito[];

  @OneToMany(() => PagoSeparado, (pagoSeparado) => pagoSeparado.idTienda)
  pagoSeparados!: PagoSeparado[];

  @OneToMany(() => Separado, (separado) => separado.idTienda)
  separados!: Separado[];

  @OneToMany(() => TicketCredito, (ticketCredito) => ticketCredito.idTienda)
  ticketCreditos!: TicketCredito[];

  @OneToMany(() => Venta, (venta) => venta.idTienda)
  ventas!: Venta[];
}