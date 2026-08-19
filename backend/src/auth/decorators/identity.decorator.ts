import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Identity = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const cliente: Record<string, any> | undefined = request.cliente;
    if (!data) return cliente;
    return cliente?.[data];
  },
);