import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { User, Username } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { PasswordValidator } from 'src/utils/password-validator';
import { ErrorHandler } from 'src/utils/error-handler';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto): Promise<any> {
    await PasswordValidator.validate(createUserDto.password);
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const processedUsername = createUserDto.usernames[0].username.replace(
        /\s+/g,
        '+',
      );
      const defaultProfileImageUrl = `https://avatar.iran.liara.run/username?username=${processedUsername}`;

      const user = await this.prisma.user.create({
        data: {
          password: hashedPassword,
          enabled: createUserDto.enabled,
          profileImageUrl:
            createUserDto.profileImageUrl || defaultProfileImageUrl,
          personId: createUserDto.personId,
          banned: false,
          blocked: false,
          lastSignInAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          usernames: {
            create: createUserDto.usernames.map((username) => ({
              username: username.username,
              organizationId: username.organizationId,
            })),
          },
        },
        include: {
          usernames: true,
        },
      });

      return this.excludePassword(user);
    } catch (error) {
      ErrorHandler.handle(error, 'Erro ao criar usuário.');
    }
  }

  async getTotalUsers(): Promise<{ total: number }> {
    try {
      const total = await this.prisma.user.count();
      return { total };
    } catch (error) {
      ErrorHandler.handle(error, 'Erro ao contar usuários.');
    }
  }

  async findAllByOrganization(organizationId: string): Promise<any[]> {
    try {
      const users = await this.prisma.user.findMany({
        where: { usernames: { some: { organizationId } } },
        include: { usernames: true },
      });
      return users.map((user) => this.excludePassword(user));
    } catch (error) {
      ErrorHandler.handle(error, 'Erro ao buscar usuários pela organização.');
    }
  }

  async findOneById(id: string): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        include: { usernames: true },
      });
      if (!user) {
        ErrorHandler.notFound('Usuário não encontrado');
      }
      return this.excludePassword(user);
    } catch (error) {
      ErrorHandler.handle(error, 'Usuário não encontrado');
    }
  }

  async findOneByUsername(
    username: string,
    organizationId: string,
  ): Promise<any> {
    try {
      const usernameRecord = await this.prisma.username.findUnique({
        where: {
          username_organizationId: {
            username,
            organizationId,
          },
        },
        include: {
          user: {
            include: {
              usernames: true,
            },
          },
        },
      });

      if (!usernameRecord) {
        ErrorHandler.notFound('username não encontrado');
      }

      return this.excludePassword(usernameRecord.user);
    } catch (error) {
      ErrorHandler.handle(error, 'Erro ao buscar usuário pelo username.');
    }
  }

  async createUsername(
    userId: string,
    username: string,
    organizationId: string,
  ): Promise<Username> {
    try {
      const userExists = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!userExists) {
        ErrorHandler.notFound('Usuário não encontrado');
      }

      const existingUsername = await this.prisma.username.findUnique({
        where: {
          username_organizationId: {
            username,
            organizationId,
          },
        },
      });

      if (existingUsername) {
        ErrorHandler.conflict('Este nome de usuário já existe na organização');
      }

      return this.prisma.username.create({
        data: {
          userId,
          username,
          organizationId,
        },
      });
    } catch (error) {
      ErrorHandler.handle(error, 'Erro ao criar nome de usuário.');
    }
  }

  async deleteUsername(usernameId: string): Promise<void> {
    try {
      await this.prisma.username.delete({
        where: { id: usernameId },
      });
    } catch (error) {
      ErrorHandler.handle(error, 'Erro ao deletar nome de usuário.');
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      await this.prisma.user.delete({
        where: { id: userId },
      });
    } catch (error) {
      ErrorHandler.handle(error, 'Erro ao deletar usuário.');
    }
  }

  async findUserByUsernameOrEmailOrId(
    login: string,
  ): Promise<(User & { usernames: Username[] }) | null> {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          OR: [{ usernames: { some: { username: login } } }, { id: login }],
        },
        include: { usernames: true },
      });

      if (!user) {
        ErrorHandler.notFound('Usuário não encontrado');
      }

      return user;
    } catch (error) {
      ErrorHandler.handle(error, 'Usuário não encontrado');
    }
  }

  async updatePassword(userId: string, newPassword: string): Promise<User> {
    await PasswordValidator.validate(newPassword);
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      return this.prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });
    } catch (error) {
      ErrorHandler.handle(error, 'Erro ao atualizar a senha.');
    }
  }

  async updateEnabledStatus(userId: string, enabled: boolean): Promise<any> {
    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: { enabled },
        include: { usernames: true },
      });
      return this.excludePassword(user);
    } catch (error) {
      ErrorHandler.handle(error, 'Erro ao atualizar o status de enabled.');
    }
  }

  async updateBlockedStatus(userId: string, blocked: boolean): Promise<any> {
    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: { blocked },
        include: { usernames: true },
      });
      return this.excludePassword(user);
    } catch (error) {
      ErrorHandler.handle(error, 'Erro ao atualizar o status de bloqueio.');
    }
  }

  async updateBannedStatus(userId: string, banned: boolean): Promise<any> {
    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: { banned },
        include: { usernames: true },
      });
      return this.excludePassword(user);
    } catch (error) {
      ErrorHandler.handle(error, 'Erro ao atualizar o status de banimento.');
    }
  }

  private excludePassword(user: User & { usernames: Username[] }) {
    const usernames = user.usernames.map(({ ...rest }) => rest);
    return { ...user, usernames };
  }

  async updateProfileImage(
    userId: string,
    profileImageUrl: string,
  ): Promise<any> {
    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: { profileImageUrl },
        include: { usernames: true },
      });
      return this.excludePassword(user);
    } catch (error) {
      ErrorHandler.handle(error, 'Erro ao atualizar a imagem de perfil.');
    }
  }

  async updateLoggedOrganizationId(
    userId: string,
    organizationId: string | null,
  ): Promise<any> {
    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: { loggedOrganizationId: organizationId },
        include: { usernames: true },
      });
      return this.excludePassword(user);
    } catch (error) {
      ErrorHandler.handle(error, 'Erro ao atualizar loggedOrganizationId.');
    }
  }
}
