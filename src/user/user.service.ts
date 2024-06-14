// src/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const now = Math.floor(Date.now() / 1000); // Convertendo para segundos
    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
        lastActiveAt: now,
        createdAt: now,
        updatedAt: now,
      },
      include: {
        userOrganization: {
          include: {
            organization: true,
          },
        },
        emailAddresses: true,
        phoneNumbers: true,
        permissions: true,
        registrationNumbers: true,
        userApp: true,
      },
    });

    // Criação de registros relacionados com valores padrão
    await this.prisma.emailAddress.create({
      data: {
        email_address: '',
        reserved: false,
        userId: user.id,
        createdAt: now,
        updatedAt: now,
      },
    });

    await this.prisma.phoneNumber.create({
      data: {
        phone_number: '',
        reserved_for_second_factor: false,
        default_second_factor: false,
        reserved: false,
        userId: user.id,
        createdAt: now,
        updatedAt: now,
      },
    });

    await this.prisma.permission.create({
      data: {
        actionId: '',
        userId: user.id,
      },
    });

    await this.prisma.registrationNumbers.create({
      data: {
        registrationNumber: '',
        personId: user.id,
      },
    });

    await this.prisma.userApp.create({
      data: {
        userId: user.id,
        appId: '', // Preencha com o ID do aplicativo padrão, se houver
        organizationId: '', // Preencha com o ID da organização padrão, se houver
      },
    });

    return this.findOne(user.id);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.prisma.user.findMany({
      include: {
        userOrganization: {
          include: {
            organization: true,
          },
        },
        emailAddresses: true,
        phoneNumbers: true,
        permissions: true,
        registrationNumbers: true,
        userApp: true,
      },
    });
    return users.map((user) => this.formatUserResponse(user));
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        userOrganization: {
          include: {
            organization: true,
          },
        },
        emailAddresses: true,
        phoneNumbers: true,
        permissions: true,
        registrationNumbers: true,
        userApp: true,
      },
    });
    return this.formatUserResponse(user);
  }

  async findOneByEmail(email: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        userOrganization: {
          include: {
            organization: true,
          },
        },
        emailAddresses: true,
        phoneNumbers: true,
        permissions: true,
        registrationNumbers: true,
        userApp: true,
      },
    });
    return this.formatUserResponse(user);
  }

  async findOneByUsername(username: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: {
        userOrganization: {
          include: {
            organization: true,
          },
        },
        emailAddresses: true,
        phoneNumbers: true,
        permissions: true,
        registrationNumbers: true,
        userApp: true,
      },
    });
    return this.formatUserResponse(user);
  }

  async findOneByIdentificationDocument(
    identificationDocument: string,
  ): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { identificationDocument },
      include: {
        userOrganization: {
          include: {
            organization: true,
          },
        },
        emailAddresses: true,
        phoneNumbers: true,
        permissions: true,
        registrationNumbers: true,
        userApp: true,
      },
    });
    return this.formatUserResponse(user);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const now = Math.floor(Date.now() / 1000); // Convertendo para segundos
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...updateUserDto,
        updatedAt: now,
      },
      include: {
        userOrganization: {
          include: {
            organization: true,
          },
        },
        emailAddresses: true,
        phoneNumbers: true,
        permissions: true,
        registrationNumbers: true,
        userApp: true,
      },
    });
    return this.formatUserResponse(user);
  }

  async remove(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.delete({
      where: { id },
      include: {
        userOrganization: {
          include: {
            organization: true,
          },
        },
        emailAddresses: true,
        phoneNumbers: true,
        permissions: true,
        registrationNumbers: true,
        userApp: true,
      },
    });
    return this.formatUserResponse(user);
  }

  private formatUserResponse(user: any): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      profile_image_url: user.picture || '',
      image_url: user.picture || '',
      has_image: !!user.picture,
      email_addresses:
        user.emailAddresses?.map((email: any) => ({
          id: email.id,
          email_address: email.email_address,
          reserved: email.reserved,
          created_at: email.createdAt || 0,
          updated_at: email.updatedAt || 0,
        })) || [],
      phone_numbers:
        user.phoneNumbers?.map((phone: any) => ({
          id: phone.id,
          phone_number: phone.phone_number,
          reserved_for_second_factor: phone.reserved_for_second_factor,
          default_second_factor: phone.default_second_factor,
          reserved: phone.reserved,
          created_at: phone.createdAt || 0,
          updated_at: phone.updatedAt || 0,
        })) || [],
      last_sign_in_at: user.last_sign_in_at || 0,
      banned: !!user.banned,
      locked: !!user.locked,
      updated_at: user.updated_at || 0,
      created_at: user.created_at || 0,
      last_active_at: user.last_active_at || 0,
      organizations:
        user.userOrganization?.map((userOrg: any) => ({
          id: userOrg.organization.id,
          name: userOrg.organization.name,
        })) || [],
      group_members:
        user.groupMembers?.map((groupMember: any) => ({
          id: groupMember.id,
          group_id: groupMember.groupId,
        })) || [],
      permissions:
        user.permissions?.map((permission: any) => ({
          id: permission.id,
          action_id: permission.actionId,
        })) || [],
      registration_numbers:
        user.registrationNumbers?.map((regNumber: any) => ({
          id: regNumber.id,
          registration_number: regNumber.registrationNumber,
        })) || [],
      user_apps:
        user.userApp?.map((userApp: any) => ({
          id: userApp.id,
          app_id: userApp.appId,
          organization_id: userApp.organizationId,
        })) || [],
      password: user.password,
    };
  }
}
