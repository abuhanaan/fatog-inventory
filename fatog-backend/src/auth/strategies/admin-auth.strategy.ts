import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwt_secret } from '../auth.module';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'admin-auth') {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwt_secret,
    });
  }

  async validate(payload: { userId: number }) {
    const user = await this.usersService.findOne(payload.userId);
    console.log(user);

    if (!user) {
      throw new UnauthorizedException({
        message: 'You are not a logged in user',
        error: 'UnAuthoried',
      });
    }

    if (user.active === false) {
      throw new UnauthorizedException({
        message:
          'Your account has been DEACTIVATED, please contact the management for more information',
        error: 'Unauthorised',
      });
    }

    if (user.role !== 'admin') {
      throw new UnauthorizedException({
        message: 'You are not authorised to access this resource',
        error: 'Unauthorised',
      });
    }
    return user;
  }
}
