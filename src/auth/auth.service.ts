// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(login: string, pass: string): Promise<any> {
    const user =
      (await this.userService.findOneByEmail(login)) ||
      (await this.userService.findOneByUsername(login)) ||
      (await this.userService.findOneByIdentificationDocument(login));

    if (!user || !user.password) {
      throw new UnauthorizedException();
    }

    const isPasswordValid = bcrypt.compareSync(pass, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
