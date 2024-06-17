import { ApiProperty } from '@nestjs/swagger';
import { CreateUsernameDto } from './create-username.dto';

export class CreateUserDto {
  @ApiProperty({ description: 'Senha do usuário', example: '12345678Ab!' })
  password: string;

  @ApiProperty({ description: 'Status do usuário', example: true })
  enabled: boolean;

  @ApiProperty({
    description: 'URL da imagem de perfil',
    example: '',
  })
  profileImageUrl: string;

  @ApiProperty({ description: 'ID da pessoa', example: 'person-id' })
  personId: string;

  @ApiProperty({ type: [CreateUsernameDto], description: 'Lista de usernames' })
  usernames: CreateUsernameDto[];
}
