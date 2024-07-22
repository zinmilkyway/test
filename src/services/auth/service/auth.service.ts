import {
  ForbiddenException,
  Injectable,
  NotFoundException,
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
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwt: JwtService,
    private configService: ConfigService
  ) {}

  async signup(user: SignUpDto): Promise<SignUpDto> {
    const foundUser = await this.userRepository.findOne({
      where: { username: user.username }
    });
    if (foundUser) throw new ForbiddenException('User already exists');
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    if (user.role === undefined) user.role = 'user';
    if (user.role === 'admin')
      throw new ForbiddenException('Admin cannot be created');
    await this.userRepository.save(user);
    return user;
  }
  async login(user: LoginDto) {
    const payload = {
      username: user.username,
      password: user.password
    };

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
  async changePassword(user: ChangePasswordDto, req: LoginDto) {
    const payload = {
      currentPassword: user.currentPassword,
      newPassword: user.newPassword
    };

    const foundUser = await this.userRepository.findOne({
      where: { username: req.username }
    });

    if (!foundUser) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      payload.currentPassword,
      foundUser.password
    );

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(payload.newPassword, salt);

    if (!isPasswordValid) {
      throw new ForbiddenException('Current password is incorrect');
    }

    foundUser.password = hash;

    await this.userRepository.update(
      { username: req.username },
      { password: foundUser.password }
    );

    return { message: 'Password updated successfully' };
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
        expiresIn: this.configService.getOrThrow('TOKEN_TIMEOUT') || '5h',
        audience: 'access'
      }),
      accessTokenExpiry:
        Date.now() + this.configService.getOrThrow('TOKEN_TIMEOUT') || '5h',
      refreshToken: await this.jwt.signAsync(user, {
        expiresIn:
          Date.now() + this.configService.getOrThrow('TOKEN_TIMEOUT') || '5h',
        audience: 'refresh',
        jwtid: randomUUID()
      }),
      refreshTokenExpiry:
        Date.now() + this.configService.getOrThrow('TOKEN_TIMEOUT') || '5h',
      user
    };
    return response;
  }

  getAccountInfo = async (req: any) => {
    const user = await this.userRepository.findOne({
      where: { username: req.username }
    });
    delete user.password;
    delete user.name;
    return user;
  };
}
