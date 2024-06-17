// src/user/user.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { UploadService } from '../upload/upload.service';
import * as multer from 'multer';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ErrorHandler } from 'src/utils/error-handler';

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não suportado'), false);
  }
};

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso.' })
  @ApiBody({ type: CreateUserDto })
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.userService.createUser(createUserDto);
    } catch (error) {
      ErrorHandler.handle(error, 'Erro ao criar usuário.');
    }
  }

  @Get()
  @ApiOperation({ summary: 'Obtém todos os usuários da mesma organização' })
  @ApiResponse({
    status: 200,
    description: 'Lista de todos os usuários da mesma organização.',
    type: [CreateUserDto],
  })
  async findAll(@Request() req) {
    try {
      return await this.userService.findAllByOrganization(
        req.user.organizationId,
      );
    } catch (error) {
      ErrorHandler.handle(error, 'Erro ao buscar usuários pela organização.');
    }
  }

  @Get('me')
  @ApiOperation({ summary: 'Obtém os dados do usuário logado' })
  @ApiResponse({
    status: 200,
    description: 'Dados do usuário logado.',
    type: CreateUserDto,
  })
  async getProfile(@Request() req) {
    try {
      return await this.userService.findOneById(req.user.userId);
    } catch (error) {
      ErrorHandler.handle(error, 'Erro ao buscar dados do usuário logado.');
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtém detalhes de um usuário pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Detalhes do usuário obtidos com sucesso.',
    type: CreateUserDto,
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  async getUserById(@Param('id') id: string) {
    try {
      return await this.userService.findOneById(id);
    } catch (error) {
      ErrorHandler.handle(error, 'Erro ao buscar usuário pelo ID.');
    }
  }

  @Patch(':id/password')
  @ApiOperation({ summary: 'Atualiza a senha do usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiBody({ schema: { example: { newPassword: '12345678Ab!' } } })
  @ApiResponse({ status: 200, description: 'Senha atualizada com sucesso.' })
  async updatePassword(
    @Param('id') id: string,
    @Body() { newPassword }: UpdatePasswordDto,
  ) {
    try {
      return await this.userService.updatePassword(id, newPassword);
    } catch (error) {
      ErrorHandler.handle(error, 'Erro ao atualizar a senha.');
    }
  }

  @Patch(':id/enable')
  @ApiOperation({ summary: 'Ativa um usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário ativado com sucesso.' })
  async enableUser(@Param('id') id: string) {
    try {
      return await this.userService.updateEnabledStatus(id, true);
    } catch (error) {
      ErrorHandler.handle(error, 'Erro ao ativar usuário.');
    }
  }

  @Patch(':id/disable')
  @ApiOperation({ summary: 'Desativa um usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário desativado com sucesso.' })
  async disableUser(@Param('id') id: string) {
    try {
      return await this.userService.updateEnabledStatus(id, false);
    } catch (error) {
      ErrorHandler.handle(error, 'Erro ao desativar usuário.');
    }
  }

  @Patch(':id/block')
  @ApiOperation({ summary: 'Bloqueia um usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário bloqueado com sucesso.' })
  async blockUser(@Param('id') id: string) {
    try {
      return await this.userService.updateBlockedStatus(id, true);
    } catch (error) {
      ErrorHandler.handle(error, 'Erro ao bloquear usuário.');
    }
  }

  @Patch(':id/unblock')
  @ApiOperation({ summary: 'Desbloqueia um usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Usuário desbloqueado com sucesso.',
  })
  async unblockUser(@Param('id') id: string) {
    try {
      return await this.userService.updateBlockedStatus(id, false);
    } catch (error) {
      ErrorHandler.handle(error, 'Erro ao desbloquear usuário.');
    }
  }

  @Patch(':id/ban')
  @ApiOperation({ summary: 'Bane um usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário banido com sucesso.' })
  async banUser(@Param('id') id: string) {
    try {
      return await this.userService.updateBannedStatus(id, true);
    } catch (error) {
      ErrorHandler.handle(error, 'Erro ao banir usuário.');
    }
  }

  @Patch(':id/unban')
  @ApiOperation({ summary: 'Desbane um usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário desbanido com sucesso.' })
  async unbanUser(@Param('id') id: string) {
    try {
      return await this.userService.updateBannedStatus(id, false);
    } catch (error) {
      ErrorHandler.handle(error, 'Erro ao desbanir usuário.');
    }
  }

  @Post('username/:userId/:username/:organizationId')
  @ApiOperation({ summary: 'Cria um nome de usuário' })
  @ApiParam({ name: 'userId', description: 'ID do usuário' })
  @ApiParam({ name: 'username', description: 'Nome de usuário' })
  @ApiParam({ name: 'organizationId', description: 'ID da organização' })
  @ApiBody({ schema: { example: { password: '12345678Ab!' } } })
  @ApiResponse({
    status: 201,
    description: 'Nome de usuário criado com sucesso.',
  })
  @ApiResponse({
    status: 409,
    description: 'Nome de usuário já existe na organização.',
  })
  async createUsername(
    @Param('userId') userId: string,
    @Param('username') username: string,
    @Param('organizationId') organizationId: string,
  ) {
    try {
      return await this.userService.createUsername(
        userId,
        username,
        organizationId,
      );
    } catch (error) {
      ErrorHandler.handle(error, 'Erro ao criar nome de usuário.');
    }
  }

  @Delete('username/:id')
  @ApiOperation({ summary: 'Deleta um nome de usuário' })
  @ApiParam({ name: 'id', description: 'ID do nome de usuário' })
  @ApiResponse({
    status: 200,
    description: 'Nome de usuário deletado com sucesso.',
  })
  async deleteUsername(@Param('id') id: string) {
    try {
      return await this.userService.deleteUsername(id);
    } catch (error) {
      ErrorHandler.handle(error, 'Erro ao deletar nome de usuário.');
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deleta um usuário pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário deletado com sucesso.' })
  async deleteUser(@Param('id') id: string) {
    try {
      return await this.userService.deleteUser(id);
    } catch (error) {
      ErrorHandler.handle(error, 'Erro ao deletar usuário.');
    }
  }

  @Patch(':id/profile-image')
  @UseInterceptors(FileInterceptor('file', { storage, fileFilter }))
  @ApiOperation({ summary: 'Atualiza a imagem de perfil do usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Arquivo de imagem',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Imagem de perfil atualizada com sucesso.',
  })
  async updateProfileImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const user = await this.userService.findOneById(id);

      if (!user) {
        ErrorHandler.notFound('Usuário não encontrado');
      }

      const profileImageUrl = await this.uploadService.uploadFile(
        file,
        user.id,
        user.usernames[0].username,
      );
      return await this.userService.updateProfileImage(id, profileImageUrl);
    } catch (error) {
      ErrorHandler.handle(error, 'Erro ao atualizar a imagem de perfil.');
    }
  }
}
