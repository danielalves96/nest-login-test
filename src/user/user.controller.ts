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
  BadRequestException,
  NotFoundException,
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

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new BadRequestException('Tipo de arquivo não suportado'), false);
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
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtém todos os usuários da mesma organização' })
  @ApiResponse({
    status: 200,
    description: 'Lista de todos os usuários da mesma organização.',
    type: [CreateUserDto],
  })
  findAll(@Request() req) {
    return this.userService.findAllByOrganization(req.user.organizationId);
  }

  @Get('me')
  @ApiOperation({ summary: 'Obtém os dados do usuário logado' })
  @ApiResponse({
    status: 200,
    description: 'Dados do usuário logado.',
    type: CreateUserDto,
  })
  getProfile(@Request() req) {
    return this.userService.findOneById(req.user.userId);
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
  getUserById(@Param('id') id: string) {
    return this.userService.findOneById(id);
  }

  @Patch(':id/password')
  @ApiOperation({ summary: 'Atualiza a senha do usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiBody({ schema: { example: { password: '12345678Ab!' } } })
  @ApiResponse({ status: 200, description: 'Senha atualizada com sucesso.' })
  updatePassword(@Param('id') id: string, @Body('password') password: string) {
    return this.userService.updatePassword(id, password);
  }

  @Patch(':id/enable')
  @ApiOperation({ summary: 'Ativa um usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário ativado com sucesso.' })
  enableUser(@Param('id') id: string) {
    return this.userService.updateEnabledStatus(id, true);
  }

  @Patch(':id/disable')
  @ApiOperation({ summary: 'Desativa um usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário desativado com sucesso.' })
  disableUser(@Param('id') id: string) {
    return this.userService.updateEnabledStatus(id, false);
  }

  @Patch(':id/block')
  @ApiOperation({ summary: 'Bloqueia um usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário bloqueado com sucesso.' })
  blockUser(@Param('id') id: string) {
    return this.userService.updateBlockedStatus(id, true);
  }

  @Patch(':id/unblock')
  @ApiOperation({ summary: 'Desbloqueia um usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Usuário desbloqueado com sucesso.',
  })
  unblockUser(@Param('id') id: string) {
    return this.userService.updateBlockedStatus(id, false);
  }

  @Patch(':id/ban')
  @ApiOperation({ summary: 'Bane um usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário banido com sucesso.' })
  banUser(@Param('id') id: string) {
    return this.userService.updateBannedStatus(id, true);
  }

  @Patch(':id/unban')
  @ApiOperation({ summary: 'Desbane um usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário desbanido com sucesso.' })
  unbanUser(@Param('id') id: string) {
    return this.userService.updateBannedStatus(id, false);
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
  createUsername(
    @Param('userId') userId: string,
    @Param('username') username: string,
    @Param('organizationId') organizationId: string,
  ) {
    return this.userService.createUsername(userId, username, organizationId);
  }

  @Delete('username/:id')
  @ApiOperation({ summary: 'Deleta um nome de usuário' })
  @ApiParam({ name: 'id', description: 'ID do nome de usuário' })
  @ApiResponse({
    status: 200,
    description: 'Nome de usuário deletado com sucesso.',
  })
  deleteUsername(@Param('id') id: string) {
    return this.userService.deleteUsername(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deleta um usuário pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário deletado com sucesso.' })
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
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
    const user = await this.userService.findOneById(id);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const profileImageUrl = await this.uploadService.uploadFile(
      file,
      user.id,
      user.usernames[0].username,
    );
    return this.userService.updateProfileImage(id, profileImageUrl);
  }
}
