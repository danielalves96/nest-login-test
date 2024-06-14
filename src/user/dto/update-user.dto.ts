import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ required: false })
  username?: string;

  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  password?: string;

  @ApiProperty({ required: false })
  identificationDocument?: string;

  @ApiProperty({ required: false })
  email?: string;

  @ApiProperty({ required: false })
  phone?: string;

  @ApiProperty({ required: false })
  mobilePhone?: string;

  @ApiProperty({ required: false })
  picture?: string;
}
