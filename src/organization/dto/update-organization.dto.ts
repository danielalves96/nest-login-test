import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrganizationDto {
  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  identificationDocument?: string;

  @ApiProperty({ required: false })
  subdomain?: string;

  @ApiProperty({ required: false })
  email?: string;

  @ApiProperty({ required: false })
  phone?: string;

  @ApiProperty({ required: false })
  contactName?: string;

  @ApiProperty({ required: false })
  contactPhone?: string;

  @ApiProperty({ required: false })
  imageUrl?: string;

  @ApiProperty({ required: false })
  siteUrl?: string;

  @ApiProperty({ required: false })
  storageLimit?: number;

  @ApiProperty({ required: false })
  contractId?: string;
}
