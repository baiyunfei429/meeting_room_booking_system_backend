import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    response.statusCode = exception.getStatus();

    const res = exception.getResponse() as {message: string[]};
    const raw = (res as any)?.message;
    const message = Array.isArray(raw) ? raw.join(', ') : raw;

    response.json({
      code: exception.getStatus(),
      message: 'fail',
      data: message || exception.message,
    }).end();
  }
}
