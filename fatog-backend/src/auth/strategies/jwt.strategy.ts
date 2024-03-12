import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwt_secret } from '../auth.module';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'user-auth') {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwt_secret,
    });
  }

  async validate(payload: { userId: number }) {
    console.log('auth bearer in action');
    const user = await this.usersService.findOne(payload.userId);

    if (!user) {
      console.log('Nout User Exception Thrown');
      throw new UnauthorizedException();
    }

    if (user.active === false) {
      throw new UnauthorizedException({
        message:
          'Your account has been DEACTIVATED, please contact the management for more information',
        error: 'Unauthorised',
      });
    }

    return user;
  }

  // async validateAdmin(payload: { userId: number }) {
  //   const user = await this.usersService.findOne(payload.userId);

  //   if (user.role !== 'admin') {
  //     throw new UnauthorizedException({
  //       message: 'You are not authorised to access this resource',
  //       error: 'Unauthorised',
  //     });
  //   }
  // }
}
