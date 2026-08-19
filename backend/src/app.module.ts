import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { EnvModule } from './config/env.module';
import { JwtModule } from '@nestjs/jwt';

import { ConfigModule, ConfigService } from '@nestjs/config';
import type { JwtModuleOptions } from '@nestjs/jwt';
import type { StringValue } from 'ms';
import { MarcaModule } from './marca/marca.module';
import { AnuncioModule } from './anuncio/anuncio.module';
import { CargoModule } from './cargo/cargo.module';
import { CategoriaModule } from './categoria/categoria.module';
import { ClienteModule } from './cliente/cliente.module';
import { ComprobanteModule } from './comprobante/comprobante.module';
import { DocumentoModule } from './documento/documento.module';
import { EstadoClienteModule } from './estado-cliente/estado-cliente.module';
import { MetodoPagoModule } from './metodo-pago/metodo-pago.module';
import { PermisoModule } from './permiso/permiso.module';
import { TiendaModule } from './tienda/tienda.module';
import { AuthModule } from './auth/auth.module';
import { RolModule } from './rol/rol.module';
import { ModuloModule } from './modulo/modulo.module';
import { AccionModule } from './accion/accion.module';
import { RolPermisoModule } from './rol-permiso/rol-permiso.module';
import { UserModule } from './user/user.module';
import { SubCategoriaModule } from './sub-categoria/sub-categoria.module';
import { TipoProductoModule } from './tipo-producto/tipo-producto.module';
import { ProductoTipoProductoModule } from './producto-tipo-producto/producto-tipo-producto.module';
import { TipoProductoSubCategoriaModule } from './sub-categoria-tipo-producto/sub-categoria-tipo-producto.module';
import { ProductoModule } from './producto/producto.module';
import { ProductoTiendaModule } from './producto-tienda/producto-tienda.module';
import { UploadModule } from './upload/upload.module';
import { ProductoColorModule } from './producto-color/producto-color.module';
import { ColorModule } from './color/color.module';
import { CarritoModule } from './carrito/carrito.module';
import { FavoritosModule } from './favoritos/favoritos.module';
import { PedidoModule} from './pedido/pedido.module';
import { UbigeoModule } from './ubigeo/ubigeo.module';
@Module({
  imports: [
    EnvModule,
    AuthModule,
    TypeOrmModule.forRootAsync({
      imports : [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql', // ← Hardcodear temporalmente
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASS'),
        database: config.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
        logging: config.get<string>('NODE_ENV') !== 'production',
      })
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      global: true,
      useFactory: (config: ConfigService): JwtModuleOptions => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: (config.get<string>('JWT_EXPIRES_IN') || '30m') as StringValue
      },
      }),
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [{
        ttl: 60000,
        limit: config.get<string>('NODE_ENV') === 'production' ? 100 : 1000,
      }],
    }),

    // ServeStaticModule configuration to serve static files
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // Serve the "public" folder
      serveRoot: '/public', // Files will be accessible under "/public"
    }),

    MarcaModule,
    AnuncioModule,
    CargoModule,
    CategoriaModule,
    ClienteModule,
    ComprobanteModule,
    DocumentoModule,
    EstadoClienteModule,
    MetodoPagoModule,
    PermisoModule,
    TiendaModule,
    RolModule,
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
    ConfigModule,
    UbigeoModule,
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

