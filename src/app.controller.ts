import { Controller, Get, SetMetadata } from '@nestjs/common';
import { AppService } from './app.service.js';
import { RequireLogin, RequirePermission } from './custom.decorator.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('aaa')
  // @SetMetadata('require-login', true)
  // @SetMetadata('require-permission', ['ddd'])
  @RequireLogin()
  @RequirePermission('ddd')
  aaa() {
    return 'aaa';
  }

  @Get('health')
  health() {
    return { status: 'ok' };
  }

  @Get('bbb')
  bbb() {
    return 'bbb';
  }
}
