import {
  validateOrReject,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';
import { ErrorHandler } from './error-handler';

export class PasswordValidator {
  @IsString({ message: 'A senha deve ser uma string' })
  @MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres' })
  @Matches(/[A-Za-z]/, { message: 'A senha deve conter letras' })
  @Matches(/[0-9]/, { message: 'A senha deve conter números' })
  @Matches(/[^A-Za-z0-9]/, {
    message: 'A senha deve conter pelo menos um caractere especial',
  })
  @Matches(/[A-Z]/, {
    message: 'A senha deve conter pelo menos uma letra maiúscula',
  })
  password: string;

  static async validate(password: string) {
    const validator = new PasswordValidator();
    validator.password = password;
    try {
      await validateOrReject(validator, {
        whitelist: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
      });
    } catch (errors) {
      const errorMessages = errors
        .map((error) => Object.values(error.constraints).join(', '))
        .join(', ');
      ErrorHandler.handle(
        new Error(errorMessages),
        'Erro de validação da senha:',
      );
    }
  }
}
