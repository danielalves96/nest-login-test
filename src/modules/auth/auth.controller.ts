import {
  Controller,
  Request,
  Post,
  UseGuards,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import {
  ApiTags,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Autentica o usuário e retorna um token JWT' })
  @ApiBody({
    schema: {
      example: { login: 'username', password: '12345678Ab!' },
    },
  })
  @ApiResponse({ status: 201, description: 'Login bem-sucedido.' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard) // Protege a rota de logout
  @ApiBearerAuth() // Adiciona o cabeçalho de autorização no Swagger
  @ApiOperation({ summary: 'Realiza logout do usuário' })
  @ApiResponse({ status: 200, description: 'Logout bem-sucedido.' })
  @Post('logout')
  async logout(@Request() req, @Res() res) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    await this.authService.logout(token);

    return res.status(HttpStatus.OK).json({ message: 'Logout bem-sucedido.' });
  }
}
