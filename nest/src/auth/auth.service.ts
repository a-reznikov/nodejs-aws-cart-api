import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/services/users.service';
import { User } from '../users/models';
import { UserEntity } from '../users/entities/user.entity';
// import { contentSecurityPolicy } from 'helmet';
type TokenResponse = {
  token_type: string;
  access_token: string;
};

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(payload: User) {
    const user = await this.usersService.findOne(payload.name);

    if (user) {
      throw new BadRequestException('User with such name already exists');
    }

    const newUser = await this.usersService.createOne(payload);

    return { userId: newUser.id };
  }

  async validateUser(
    username: string,
    pass: string,
  ): Promise<UserEntity | null> {
    const user = await this.usersService.findOne(username);
    if (!user) {
      return null;
    }

    if (user.password === pass) {
      return user;
    }

    return null;
  }

  async login(
    user: User,
    type: 'jwt' | 'basic' | 'default',
  ): Promise<TokenResponse> {
    console.log({ user, type });
    const LOGIN_MAP = {
      jwt: this.loginJWT,
      basic: this.loginBasic,
      default: this.loginJWT,
    };
    const login = LOGIN_MAP[type];

    return login ? login(user) : LOGIN_MAP.default(user);
  }

  private loginJWT(user: User): TokenResponse {
    const payload = { username: user.name, sub: user.id };

    return {
      token_type: 'Bearer',
      access_token: this.jwtService.sign(payload),
    };
  }

  private loginBasic(user: User): TokenResponse {
    const { name, password } = user;
    const buf = Buffer.from([name, password].join(':'), 'utf8');
    const token = buf.toString('base64');

    return {
      token_type: 'Basic',
      access_token: token,
    };
  }
}
