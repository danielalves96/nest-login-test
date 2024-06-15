import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { CreateUsernameDto } from './create-username.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: 'Última data de login do usuário',
    required: false,
    example: '2023-06-14T00:00:00Z',
  })
  lastSignInAt?: Date;

  @ApiProperty({
    description: 'Indica se o usuário está banido',
    required: false,
    example: false,
  })
  banned?: boolean;

  @ApiProperty({
    description: 'Indica se o usuário está bloqueado',
    required: false,
    example: false,
  })
  blocked?: boolean;

  @ApiProperty({
    description: 'Lista de usernames',
    type: [CreateUsernameDto],
    required: false,
  })
  usernames?: CreateUsernameDto[];
}
