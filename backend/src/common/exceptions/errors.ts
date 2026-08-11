import {
  BadRequestException,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';

/**
 * 🧩 Función reutilizable para manejar errores comunes de base de datos.
 * Se puede importar en cualquier servicio.
 */
export function handleDBError(error: Error & { code?: string }, customMessage: string): never {
  // Si ya es una excepción HTTP (por ejemplo NotFoundException o BadRequest), la relanzamos
  if (error instanceof HttpException) throw error;

  // 🔸 Errores comunes de MySQL / MariaDB
  if (error.code === 'ER_DUP_ENTRY')
    throw new BadRequestException('Ya existe un registro con esos datos.');

  if (error.code === 'ER_NO_REFERENCED_ROW_2')
    throw new BadRequestException('No existe el registro referenciado.');

  // 🔸 Errores de conexión
  if (error.code === 'ECONNREFUSED' || error.code === 'PROTOCOL_CONNECTION_LOST')
    throw new InternalServerErrorException('Error de conexión a la base de datos.');

  // 🔸 Error genérico
  throw new InternalServerErrorException(customMessage);
}


