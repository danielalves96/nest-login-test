// src/utils/error-handler.ts

import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ExceptionDictionary } from './exception-dictionary';

export class ErrorHandler {
  static handle(error: any, message?: string): void {
    // Logando o erro no console
    console.error('Error: ', error);

    if (error instanceof BadRequestException) {
      throw new BadRequestException(error.message);
    } else if (error instanceof NotFoundException) {
      throw new NotFoundException(message || error.message);
    } else if (error.code && ExceptionDictionary[error.code]) {
      throw new ConflictException(ExceptionDictionary[error.code]);
    } else if (error instanceof ConflictException) {
      throw new ConflictException(error.message);
    } else {
      throw new InternalServerErrorException(
        'Erro inesperado: ' + error.message,
      );
    }
  }

  static notFound(message: string): void {
    const error = new NotFoundException(message);
    console.error('Error: ', error);
    throw error;
  }

  static conflict(message: string): void {
    const error = new ConflictException(message);
    console.error('Error: ', error);
    throw error;
  }
}
