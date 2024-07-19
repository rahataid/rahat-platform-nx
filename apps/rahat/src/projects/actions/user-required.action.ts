import { MS_ACTIONS } from "@rahataid/sdk";

export const userRequiredActions = new Set([
    MS_ACTIONS.AAPROJECT.ACTIVITIES.UPDATE_STATUS,
    MS_ACTIONS.AAPROJECT.TRIGGERS.ACTIVATE,
    MS_ACTIONS.AAPROJECT.DAILY_MONITORING.ADD,
    MS_ACTIONS.AAPROJECT.BENEFICIARY.RESERVE_TOKEN_TO_GROUP
    // Add other actions that require user payload here
]);
