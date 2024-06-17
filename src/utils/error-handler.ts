import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

export class ErrorHandler {
  static handle(error: any): void {
    if (error instanceof BadRequestException) {
      throw new BadRequestException(error.message);
    } else if (error instanceof ConflictException) {
      throw new ConflictException(error.message);
    } else if (error instanceof NotFoundException) {
      throw new NotFoundException(error.message);
    } else if (error.code === 'P2002') {
      throw new ConflictException(
        'Este nome de usuário já existe na organização.',
      );
    } else {
      throw new InternalServerErrorException(
        'Erro inesperado: ' + error.message,
      );
    }
  }
}
