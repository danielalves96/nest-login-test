import { ApiProperty } from '@nestjs/swagger';

export class CreateOrganizationDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  identificationDocument: string;

  @ApiProperty()
  subdomain: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  contactName: string;

  @ApiProperty()
  contactPhone: string;

  @ApiProperty({ required: false })
  imageUrl?: string;

  @ApiProperty({ required: false })
  siteUrl?: string;

  @ApiProperty({ required: false })
  storageLimit?: number;

  @ApiProperty({ required: false })
  contractId?: string;
}
