import { IsString, MinLength, Matches } from 'class-validator';

export class UpdatePasswordDto {
  @IsString({ message: 'A senha deve ser uma string' })
  @MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres' })
  @Matches(/[A-Za-z]/, { message: 'A senha deve conter letras' })
  @Matches(/[0-9]/, { message: 'A senha deve conter números' })
  @Matches(/[^A-Za-z0-9]/, {
    message: 'A senha deve conter pelo menos um caractere especial',
  })
  newPassword: string;
}
