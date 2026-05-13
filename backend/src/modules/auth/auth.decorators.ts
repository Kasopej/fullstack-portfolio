import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { User } from '../user/user.entity';

export const ActiveUser = createParamDecorator(
  (data: void, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const retrievedUser = (request as any)['user'] as User | undefined;
    return retrievedUser;
  },
);
