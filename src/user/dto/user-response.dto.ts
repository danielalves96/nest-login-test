// src/user/dto/user-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class EmailAddressDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email_address: string;

  @ApiProperty()
  reserved: boolean;

  @ApiProperty()
  created_at: number;

  @ApiProperty()
  updated_at: number;
}

export class PhoneNumberDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  phone_number: string;

  @ApiProperty()
  reserved_for_second_factor: boolean;

  @ApiProperty()
  default_second_factor: boolean;

  @ApiProperty()
  reserved: boolean;

  @ApiProperty()
  created_at: number;

  @ApiProperty()
  updated_at: number;
}

export class OrganizationDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}

export class GroupMemberDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  group_id: string;
}

export class PermissionDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  action_id: string;
}

export class RegistrationNumberDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  registration_number: string;
}

export class UserAppDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  app_id: string;

  @ApiProperty()
  organization_id: string;
}

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  profile_image_url: string;

  @ApiProperty()
  image_url: string;

  @ApiProperty()
  has_image: boolean;

  @ApiProperty({ type: [EmailAddressDto] })
  email_addresses: EmailAddressDto[];

  @ApiProperty({ type: [PhoneNumberDto] })
  phone_numbers: PhoneNumberDto[];

  @ApiProperty()
  last_sign_in_at: number;

  @ApiProperty()
  banned: boolean;

  @ApiProperty()
  locked: boolean;

  @ApiProperty()
  updated_at: number;

  @ApiProperty()
  created_at: number;

  @ApiProperty()
  last_active_at: number;

  @ApiProperty({ type: [OrganizationDto] })
  organizations: OrganizationDto[];

  @ApiProperty({ type: [GroupMemberDto] })
  group_members: GroupMemberDto[];

  @ApiProperty({ type: [PermissionDto] })
  permissions: PermissionDto[];

  @ApiProperty({ type: [RegistrationNumberDto] })
  registration_numbers: RegistrationNumberDto[];

  @ApiProperty({ type: [UserAppDto] })
  user_apps: UserAppDto[];

  @ApiProperty()
  password: string;
}
