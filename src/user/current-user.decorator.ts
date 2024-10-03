import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './interfaces/user.interface';

const getCurrentUserByContext = (ctx: ExecutionContext): User => {
  return ctx.switchToHttp().getRequest().user;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => getCurrentUserByContext(ctx),
);
