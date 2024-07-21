import {
  Body,
  Controller,
  Headers,
  Post,
  Put,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiTags
} from '@nestjs/swagger/dist';
import { ChangePasswordDto } from './entities/changePassword.dto';
import { LoginDto } from './entities/login.dto';
import { RefreshTokenDto } from './entities/refreshToken.dto';
import { SignUpDto } from './entities/signUp.dto';
import { User } from './entities/user.entity';
import { AuthService } from './service/auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('Users')
@Controller('api/v1/auth/')
@ApiBearerAuth('accessToken')
@ApiBearerAuth('refreshToken')
export class AuthController {
  constructor(private usersService: AuthService) {}

  @Post('signup')
  async signup(@Body() user: SignUpDto): Promise<User> {
    return this.usersService.signup(user);
  }

  @Post('login')
  async login(@Body() user: LoginDto) {
    return this.usersService.login(user);
  }

  @Post('reissue')
  @ApiHeader({
    name: 'Authorization',
    required: false,
    description: 'RefreshToken'
  })
  @ApiBody({
    required: false,
    schema: {
      type: 'object',
      properties: {
        refreshToken: {
          type: 'string',
          format: 'string'
        }
      }
    }
  })
  async reIssueToken(
    @Body() request?: RefreshTokenDto,
    @Headers('Authorization') authorization?: string
  ) {
    const refreshToken = authorization?.startsWith('Bearer ')
      ? authorization.replace('Bearer ', '')
      : request.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }

    return this.usersService.reIssues(refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Put('change-password')
  async changePassword(@Body() password: ChangePasswordDto) {
    return this.usersService.changePassword(password);
  }
}
