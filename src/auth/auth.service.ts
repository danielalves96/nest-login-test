import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(login: string, pass: string): Promise<any> {
    const user = await this.userService.findUserByUsernameOrEmailOrId(
      login,
      pass,
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async login(user: any) {
    const payload = {
      username: user.username,
      sub: user.id,
      organizationId: user.organizationId,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
