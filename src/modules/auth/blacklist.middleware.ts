import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class BlacklistMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}

  use(req: any, res: any, next: () => void) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      next();
      return;
    }

    const token = authHeader.split(' ')[1];
    if (this.authService.isTokenBlacklisted(token)) {
      throw new UnauthorizedException('Token não é mais válido');
    }

    next();
  }
}
