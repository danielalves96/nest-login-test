import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, Username } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto): Promise<any> {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const user = await this.prisma.user.create({
        data: {
          password: hashedPassword,
          enabled: createUserDto.enabled,
          profileImageUrl: createUserDto.profileImageUrl,
          personId: createUserDto.personId,
          banned: false,
          blocked: false,
          lastSignInAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          usernames: {
            create: createUserDto.usernames.map((username) => ({
              username: username.username,
              password: bcrypt.hashSync(username.password, 10),
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
      throw new ConflictException('Erro ao criar usuário.');
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
      throw new NotFoundException('Erro ao buscar usuários pela organização.');
    }
  }

  async findOneById(id: string): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        include: { usernames: true },
      });
      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }
      return this.excludePassword(user);
    } catch (error) {
      throw new NotFoundException('Erro ao buscar usuário pelo ID.');
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
        throw new NotFoundException(
          'Nome de usuário não encontrado na organização',
        );
      }

      return this.excludePassword(usernameRecord.user);
    } catch (error) {
      throw new NotFoundException(
        'Erro ao buscar usuário pelo nome de usuário.',
      );
    }
  }

  async createUsername(
    userId: string,
    username: string,
    organizationId: string,
    password: string,
  ): Promise<Username> {
    try {
      const userExists = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!userExists) {
        throw new NotFoundException('Usuário não encontrado');
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
        throw new ConflictException(
          'Este nome de usuário já existe na organização.',
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      return this.prisma.username.create({
        data: {
          userId,
          username,
          password: hashedPassword,
          organizationId,
        },
      });
    } catch (error) {
      throw new ConflictException('Erro ao criar nome de usuário.');
    }
  }

  async deleteUsername(usernameId: string): Promise<void> {
    try {
      await this.prisma.username.delete({
        where: { id: usernameId },
      });
    } catch (error) {
      throw new NotFoundException('Nome de usuário não encontrado.');
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      await this.prisma.user.delete({
        where: { id: userId },
      });
    } catch (error) {
      throw new NotFoundException('Usuário não encontrado.');
    }
  }

  async findUserByUsernameOrEmailOrId(
    login: string,
    password: string,
  ): Promise<any> {
    try {
      const usernameRecord = await this.prisma.username.findFirst({
        where: { username: login },
        include: {
          user: {
            include: {
              usernames: true,
            },
          },
        },
      });

      if (!usernameRecord) {
        throw new NotFoundException('Nome de usuário não encontrado');
      }

      if (usernameRecord.user.banned) {
        throw new UnauthorizedException('Usuário banido');
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        usernameRecord.password,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('Senha inválida');
      }

      await this.prisma.user.update({
        where: { id: usernameRecord.userId },
        data: { lastSignInAt: new Date() },
      });

      return this.excludePassword(usernameRecord.user);
    } catch (error) {
      throw new UnauthorizedException('Erro ao validar usuário.');
    }
  }

  async updatePassword(userId: string, password: string): Promise<any> {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: {
          usernames: {
            updateMany: {
              where: { userId },
              data: { password: hashedPassword },
            },
          },
        },
        include: { usernames: true },
      });
      return this.excludePassword(user);
    } catch (error) {
      throw new NotFoundException('Erro ao atualizar a senha.');
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
      throw new NotFoundException('Erro ao atualizar o status de habilitação.');
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
      throw new NotFoundException('Erro ao atualizar o status de bloqueio.');
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
      throw new NotFoundException('Erro ao atualizar o status de banimento.');
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
      throw new NotFoundException('Erro ao atualizar a imagem de perfil.');
    }
  }
}
