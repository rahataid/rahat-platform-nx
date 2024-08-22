import { ACTIONS, SUBJECTS } from "./index";

const SYSTEM_ROLES = {
    ADMIN: 'Admin',
    MANAGER: 'Manager',
    USER: 'User',
}

export const ROLE_PERMS_REGISTRY = {
    el: {
        roles: [
            {
                name: SYSTEM_ROLES.ADMIN,
                onChain: true,
                isSystem: true,
                permissions: {
                    all: [ACTIONS.MANAGE]
                }
            },
            {
                name: SYSTEM_ROLES.MANAGER,
                onChain: false,
                isSystem: true,
                permissions: {
                    vendor: [ACTIONS.MANAGE],
                    beneficiary: [ACTIONS.READ, ACTIONS.CREATE, ACTIONS.DELETE],
                }
            },
        ],
        subjects: [SUBJECTS.BENEFICIARY, SUBJECTS.VENDOR],
    },
    cva: {
        roles: [
            {
                name: SYSTEM_ROLES.ADMIN,
                onChain: true,
                isSystem: true,
                permissions: {
                    all: [ACTIONS.MANAGE]
                }
            },
            {
                name: SYSTEM_ROLES.MANAGER,
                onChain: false,
                isSystem: true,
                permissions: {
                    beneficiary: [ACTIONS.READ]
                }
            },
        ],
        subjects: [SUBJECTS.PROJECT, SUBJECTS.BENEFICIARY],
    },
};