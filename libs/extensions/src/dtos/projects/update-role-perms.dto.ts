import { ApiProperty } from "@nestjs/swagger";
import { IsObject, IsString } from "class-validator";

export type PermissionSet = {
    [subject: string]: ('manage' | 'create' | 'read' | 'update' | 'delete')[];
};


export class UpdateRolePermsDto {
    @ApiProperty({
        type: 'string',
        required: true,
        example: 'Admin',
    })
    @IsString()
    role: string;

    @ApiProperty({
        example: JSON.stringify({
            user: ['manage', 'read'],
        }),
    })
    @IsObject()
    perms: PermissionSet;
}