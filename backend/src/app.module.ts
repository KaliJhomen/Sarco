import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import { MarcaModule } from './marca/marca.module';
import { AnuncioModule } from './anuncio/anuncio.module';
import { AgendaModule } from './agenda/agenda.module';
import { CargoModule } from './cargo/cargo.module';
import { CategoriaModule } from './categoria/categoria.module';
import { ClienteModule } from './cliente/cliente.module';
import { ComprobanteModule } from './comprobante/comprobante.module';
import { CreditoModule } from './credito/credito.module';
import { DetalleCreditoModule } from './detalle-credito/detalle-credito.module';
import { DetalleSeparadoModule } from './detalle-separado/detalle-separado.module';
import { DetalleVentaModule } from './detalle-venta/detalle-venta.module';
import { DocumentoModule } from './documento/documento.module';
import { EgresoModule } from './egreso/egreso.module';
import { EstadoClienteModule } from './estado-cliente/estado-cliente.module';
import { EstadoCreditoModule } from './estado-credito/estado-credito.module';
import { EstadoVentaModule } from './estado-venta/estado-venta.module';
import { GarantiaModule } from './garantia/garantia.module';
import { IngresoModule } from './ingreso/ingreso.module';
import { MetodoPagoModule } from './metodo-pago/metodo-pago.module';
import { PagoCreditoModule } from './pago-credito/pago-credito.module';
import { PagoSeparadoModule } from './pago-separado/pago-separado.module';
import { PenalidadesModule } from './penalidades/penalidades.module';
import { PermisoModule } from './permiso/permiso.module';
import { PlanPagoModule } from './plan-pago/plan-pago.module';
import { SeparadoModule } from './separado/separado.module';
import { ServicioModule } from './servicio/servicio.module';
import { TicketCreditoModule } from './ticket-credito/ticket-credito.module';
import { TiendaModule } from './tienda/tienda.module';
import { UsuarioPermisoModule } from './usuario-permiso/usuario-permiso.module';
import { VentaModule } from './venta/venta.module';
import { AuthModule } from './auth/auth.module';
import { RolModule } from './rol/rol.module';
import { UsuarioRolModule } from './usuario-rol/usuario-rol.module';
import { ModuloModule } from './modulo/modulo.module';
import { AccionModule } from './accion/accion.module';
import { RolPermisoModule } from './rol-permiso/rol-permiso.module';
import { UsuarioModule } from './usuario/usuario.module';
import { UserModule } from './user/user.module';
import { SubCategoriaModule } from './sub-categoria/sub-categoria.module';
import { TipoProductoModule } from './tipo-producto/tipo-producto.module';
import { ProductoTipoProductoModule } from './producto-tipo-producto/producto-tipo-producto.module';
import { TipoProductoSubCategoriaModule } from './tipo-producto-sub-categoria/tipo-producto-sub-categoria.module';
import { ProductoModule } from './producto/producto.module';
import { ProductoTiendaModule } from './producto-tienda/producto-tienda.module';
import { UploadModule } from './upload/upload.module';
import { ProductoColorModule } from './producto-color/producto-color.module';
import { ColorModule } from './color/color.module';
import { CarritoModule } from './carrito/carrito.module';
import { FavoritosModule } from './favoritos/favoritos.module';
import { PedidoModule} from './pedido/pedido.module';
import { PedidoDetalleModule } from './pedido-detalle/pedido-detalle.module';
import { ConfigModule} from './config/config.module'
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql', // ← Hardcodear temporalmente
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'sarcos_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false, 
      logging: true, 
    }),
    // ServeStaticModule configuration to serve static files
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // Serve the "public" folder
      serveRoot: '/public', // Files will be accessible under "/public"
    }),
    ThrottlerModule.forRoot([{
        ttl: 1000 * 60, 
        limit: 100,       
    }]),
    MarcaModule,
    AgendaModule,
    AnuncioModule,
    CargoModule,
    CategoriaModule,
    ClienteModule,
    ComprobanteModule,
    CreditoModule,
    DetalleCreditoModule,
    DetalleSeparadoModule,
    DetalleVentaModule,
    DocumentoModule,
    EgresoModule,
    EstadoClienteModule,
    EstadoCreditoModule,
    EstadoVentaModule,
    GarantiaModule,
    IngresoModule,
    MetodoPagoModule,
    PagoCreditoModule,
    PagoSeparadoModule,
    PenalidadesModule,
    PermisoModule,
    PlanPagoModule,
    SeparadoModule,
    ServicioModule,
    TicketCreditoModule,
    TiendaModule,
    UsuarioModule,
    UsuarioPermisoModule,
    VentaModule,
    AuthModule,
    RolModule,
    UsuarioRolModule,
    ModuloModule,
    AccionModule,
    RolPermisoModule,
    UserModule,
    SubCategoriaModule,
    TipoProductoModule,
    ProductoTipoProductoModule,
    TipoProductoSubCategoriaModule,
    ProductoModule,
    ProductoTiendaModule,
    UploadModule,
    ProductoColorModule,
    ColorModule,
    CarritoModule,
    FavoritosModule,
    PedidoModule,
    PedidoDetalleModule,
    ConfigModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

