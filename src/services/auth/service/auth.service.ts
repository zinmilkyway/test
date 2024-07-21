import {
  ForbiddenException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { ChangePasswordDto } from '../entities/changePassword.dto';
import { LoginDto } from '../entities/login.dto';
import { SignUpDto } from '../entities/signUp.dto';
import { User } from '../entities/user.entity';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwt: JwtService
  ) {}

  async signup(user: SignUpDto): Promise<User> {
    const foundUser = await this.userRepository.findOne({
      where: { username: user.username }
    });
    if (foundUser) throw new ForbiddenException();
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    return await this.userRepository.save(user);
  }
  async login(user: LoginDto) {
    const payload = {
      username: user.username,
      password: user.password
    };

    console.log(user);
    const foundUser = await this.userRepository.findOne({
      where: { username: payload.username }
    });

    if (!foundUser) throw new UnauthorizedException();

    const match = await bcrypt.compare(payload.password, foundUser.password);

    if (!match) throw new UnauthorizedException();

    const newToken = this.signToken({
      username: foundUser.username,
      role: foundUser.role
    });
    return newToken;
  }
  async changePassword(user: ChangePasswordDto) {
    const payload = {
      currentPassword: user.currentPassword,
      newPassword: user.newPassword
    };
    return {
      access_token: this.jwt.sign(payload)
    };
  }

  async reIssues(refreshToken: string) {
    try {
      const account = await this.jwt.verifyAsync<User>(refreshToken, {
        audience: 'refresh'
      });

      const refreshTokenExpiration = await this.jwt
        .verifyAsync(refreshToken, { audience: 'refresh' })
        .then((payload) => payload.exp * 1000)
        .catch(() => {
          throw new UnauthorizedException();
        });

      if (new Date(refreshTokenExpiration) > new Date()) {
        return this.signToken({
          username: account.username,
          role: account.role
        });
      } else {
        throw new UnauthorizedException();
      }
    } catch {
      throw new UnauthorizedException();
    }
  }

  async validateUser(username: string, password: string): Promise<any> {
    const foundUser = await this.userRepository.findOne({
      where: { username: username }
    });
    if (foundUser) {
      if (await bcrypt.compare(password, foundUser.password)) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = foundUser;
        return result;
      }

      return null;
    }
    return null;
  }

  async signToken(user: { username: string; role: string }) {
    const response = {
      accessToken: await this.jwt.signAsync(user, {
        expiresIn: 100000,
        audience: 'access'
      }),
      accessTokenExpiry: Date.now() + 100000,
      refreshToken: await this.jwt.signAsync(user, {
        expiresIn: Date.now() + 100000,
        audience: 'refresh',
        jwtid: randomUUID()
      }),
      refreshTokenExpiry: Date.now() + 100000,
      user
    };
    return response;
  }
}
