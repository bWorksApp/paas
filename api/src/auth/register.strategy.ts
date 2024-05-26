import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RegisterStrategy extends PassportStrategy(Strategy, 'register') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('access_token'),
      secretOrKey: process.env.JWT_VERIFY_TOKEN_SECRET,
    });
  }

  async validate(payload: any) {
    return {
      email: payload.email,
      username: payload.username,
      password: payload.password,
      fullName: payload.fullName,
      walletAddress: payload.walletAddress,
      isSmartContractDev: payload.isSmartContractDev,
      isdAppDev: payload.isdAppDev,
      authType: payload.authType,
    };
  }
}
