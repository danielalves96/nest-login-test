import { ApiProperty } from '@nestjs/swagger';
import { CreateUsernameDto } from './create-username.dto';

export class CreateUserDto {
  @ApiProperty({ description: 'A senha do usuário', example: '12345678Ab!' })
  password: string;

  @ApiProperty({
    description: 'Indica se o usuário está habilitado',
    example: true,
  })
  enabled: boolean;

  @ApiProperty({
    description: 'URL da imagem de perfil do usuário',
    example: 'http://example.com/profile.jpg',
  })
  profileImageUrl: string;

  @ApiProperty({ description: 'ID da organização do usuário', example: 'org1' })
  organizationId: string;

  @ApiProperty({ description: 'ID da pessoa do usuário', example: 'person1' })
  personId: string;

  @ApiProperty({ description: 'Lista de usernames', type: [CreateUsernameDto] })
  usernames: CreateUsernameDto[];
}
