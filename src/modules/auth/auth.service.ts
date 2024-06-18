import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private blacklistedTokens: Set<string> = new Set(); // Blacklist de tokens

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(login: string, pass: string): Promise<any> {
    const user = await this.userService.findUserByUsernameOrEmailOrId(login);

    if (!user || !user.password) {
      throw new UnauthorizedException();
    }

    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    const token = this.jwtService.sign(payload);
    return {
      access_token: token,
    };
  }

  async logout(token: string) {
    this.blacklistedTokens.add(token);
  }

  isTokenBlacklisted(token: string): boolean {
    return this.blacklistedTokens.has(token);
  }
}
