import { createParamDecorator, ExecutionContext, SetMetadata } from "@nestjs/common";
import { Request } from "express";

interface JwtUserData {
  userId: number;
  email: string;
  username: string;
  roles: string[];
  permissions: string[]
}

export const  RequireLogin = () => SetMetadata('require-login', true);

export const  RequirePermission = (...permissions: string[]) => SetMetadata('require-permission', permissions);

export const UserInfo = createParamDecorator(
  <K extends keyof JwtUserData>(data: K | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request & { user?: JwtUserData }>();
    const user = request.user;
    console.log('user 信息:', user, request);

    if (!user) return null;
    return data ? user[data] : user;
  },
);