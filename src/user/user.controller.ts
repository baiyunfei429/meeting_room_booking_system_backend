import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { UserService } from './user.service.js';
import { RegisterUserDto } from './dto/register-user.dto.js';
import { EmailService } from '../email/email.service.js';
import { RedisService } from '../redis/redis.service.js';
import { LoginUserDto } from './dto/login-user.dto.js';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Inject(EmailService)
  private emailService: EmailService

  @Inject(RedisService)
  private redisService: RedisService;

  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    return await this.userService.register(registerUser);
  }

  @Get('register-captcha')
  async captcha(@Query('address') address: string) {
    const code = Math.random().toString().slice(2, 8);
    await this.redisService.set(`captcha_${address}`, code, 5 * 60);
    await this.emailService.sendMail({
      to: address,
      subject: '注册验证码',
      html: `<p>你的注册验证码是 ${code}</p>`,
    })
    return '发送成功';
  }

  @Get("init-data")
  async initData() {
    await this.userService.initData();
    return 'done';
  }

  @Post('login')
  async userLogin(@Body() loginUser: LoginUserDto) {
    const vo = await this.userService.login(loginUser, false);

    return vo;
  }

  @Post('admin/login')
  async adminLogin(@Body() loginUser: LoginUserDto) {
    const vo = await this.userService.login(loginUser, true);

    return vo;
  }
}
