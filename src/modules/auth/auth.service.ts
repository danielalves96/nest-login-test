import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private blacklistedTokens: Set<string> = new Set();

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

    const username = user.usernames.find((u) => u.username === login);
    if (!username) {
      throw new UnauthorizedException('Username não encontrado');
    }

    return { user, username };
  }

  async login(userWithUsername: any) {
    const { user, username } = userWithUsername;
    const organizationId = username.organizationId;
    const payload = {
      username: username.username,
      sub: user.id,
      loggedOrganizationId: organizationId,
    };
    const token = this.jwtService.sign(payload);

    await this.userService.updateLoggedOrganizationId(user.id, organizationId);

    return {
      access_token: token,
    };
  }

  async logout(token: string) {
    const decodedToken = this.jwtService.decode(token) as { sub: string };

    await this.userService.updateLoggedOrganizationId(decodedToken.sub, null);

    this.blacklistedTokens.add(token);
  }

  isTokenBlacklisted(token: string): boolean {
    return this.blacklistedTokens.has(token);
  }
}
