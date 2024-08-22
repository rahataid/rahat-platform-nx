import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface CurrentUserInterface {
    id: number;
    userId: number;
    uuid: string;
    name: string | null;
    email: string | null;
    phone: string | null;
    wallet: string | null;
    roles: string[];
    permissions: {
        action: string;
        subject: string;
        inverted: boolean;
        conditions: string;
    }[];
}



export const CurrentUser = createParamDecorator(
    (data: undefined, ctx: ExecutionContext): CurrentUserInterface => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);

export const CU = CurrentUser;
