import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { writeLog } from '../utils/logger'; // ✅ ajusta la ruta

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Error interno del servidor.';

    if (exception instanceof QueryFailedError) {
      const error = exception as QueryFailedError & { code?: string };

      if (error.code === 'ER_DUP_ENTRY') {
        status = HttpStatus.BAD_REQUEST;
        message = 'Ya existe un registro con ese valor único.';
      } else if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        status = HttpStatus.BAD_REQUEST;
        message = 'La referencia a otra tabla no existe.';
      } else if (error.code === 'ECONNREFUSED') {
        status = HttpStatus.SERVICE_UNAVAILABLE;
        message = 'Error de conexión con la base de datos.';
      }
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message = typeof res === 'string' ? res : (res as any).message;
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
    };

    writeLog(
      `Status: ${status} | ${request.method} ${request.url} | Message: ${message}`,
    );

    response.status(status).json(errorResponse);
  }
}
