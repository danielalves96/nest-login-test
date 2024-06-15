import { ApiProperty } from '@nestjs/swagger';

export class CreateUsernameDto {
  @ApiProperty({ description: 'Nome de usuário', example: 'user1' })
  username: string;

  @ApiProperty({
    description: 'Senha para o nome de usuário',
    example: '12345678Ab!',
  })
  password: string;

  @ApiProperty({ description: 'ID da organização', example: 'org1' })
  organizationId: string;
}
