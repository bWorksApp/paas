import {
  Post,
  UseGuards,
  Request,
  Controller,
  Get,
  Response,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { RefreshTokenGuard } from './refresh-auth.guard';
import { RegisterAuthGuard } from './register-auth.guard';
import { ResetPasswordAuthGuard } from './reset-password-auth.guard';
import { RegisterUserDto } from '../user/dto/register-user.dto';
import { ResetPasswordUserDto } from '../user/dto/reset-password-user.dto';
import { ChangePasswordDto } from '../user/dto/change-password.dto';
import { Public } from '../flatworks/roles/public.api.decorator';
import { EventAuthGuard } from './events-auth.guard';
import { HomePageAuthGuard } from './home-page-auth.guard';
import { UserWalletRegisterDto } from '../user/dto/wallet-user-register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //email login
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @Public()
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('loginwallet')
  @Public()
  async loginWallet(@Body() loginWallet: any) {
    return this.authService.loginWallet(loginWallet);
  }
  /*
post: http://localhost:3000/auth/loginwallet
{
    "walletRewardAddress": "stake1uxww77x845hta4udeaz3s7mt6v3k3cq3qsrw7zy69hjrknc949k54",
    "signature": {
        "signature": "84582aa201276761646472657373581de19cef78c7ad2ebed78dcf45187b6bd32368e0110406ef089a2de43b4fa166686173686564f458247061617378376a64364f38645945653245365042756466646165797643387a4a697132435840f0ac7c840ab458ee213b17f5fee38be393944d2894d9bd8a54ba8b6841379f0589d6544fa0b2bd6a2a2576bd88cabbaff01a36b080273a48b1738cec8aacbd08",
        "key": "a40101032720062158200d85a6c0f50c37278214c70e9b4a40edb75d5910f541d22bf3755240af9a5c7e"
    }
}

with nonce: "7061617378376a64364f38645945653245365042756466646165797643387a4a69713243"
*/
  //cms login
  @UseGuards(LocalAuthGuard)
  @Post('adminlogin')
  @Public()
  async adminLogin(@Request() req) {
    return this.authService.adminLogin(req.user);
  }

  @UseGuards(HomePageAuthGuard)
  @Get('profile')
  @Public()
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  @Public()
  refreshTokens(@Request() req) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @Get('logout')
  logout(@Request() req) {
    this.authService.logout(req.user['userId']);
  }
  //register user with email
  @Post('register')
  @Public()
  async register(@Body() registerUser: RegisterUserDto) {
    return await this.authService.register(registerUser);
  }

  //register user with wallet
  @Post('registerwalelt')
  @Public()
  async registerWallet(@Body() registerUser: UserWalletRegisterDto) {
    return await this.authService.registerWallet(registerUser);
  }

  @UseGuards(RegisterAuthGuard)
  @Get('verify')
  @Public()
  async verify(@Request() req, @Response() res) {
    try {
      await this.authService.verify(req.user);
    } catch (error) {
      console.log(error);
      res.redirect('/api/verifyFailed.html');
      return;
    }
    res.redirect('/api/verifySucceed.html');
    return;
  }

  @Post('forgotpwd')
  @Public()
  async requestResetPassword(
    @Body() resetPasswordUserDto: ResetPasswordUserDto,
  ) {
    return await this.authService.requestResetPassword(resetPasswordUserDto);
  }

  @UseGuards(ResetPasswordAuthGuard)
  @Post('resetpwd')
  @Public()
  async resetPassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Request() req,
  ) {
    const userId = req.user['userId'];
    return await this.authService.resetPassword(changePasswordDto, userId);
  }
}
