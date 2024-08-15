export const APP_JOBS = {
  EMAIL: 'email',
  SLACK: 'slack',
  OTP: 'otp',
};

export const MS_TIMEOUT = 500000;

export const BQUEUE = {
  RAHAT: 'RAHAT',
  RAHAT_PROJECT: 'RAHAT.PROJECT',
  RAHAT_BENEFICIARY: 'RAHAT.BENEFICIARY',
  HOST: 'RAHAT.HOST',
};

export const UserRoles = {
  ADMIN: 'Admin',
  USER: 'User',
  VENDOR: 'Vendor',
};

export const ACTIONS = {
  MANAGE: 'manage',
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  READ: 'read',
};

export const SUBJECTS = {
  ALL: 'all',
  BENEFICIARY: 'beneficiary',
  PROJECT: 'project',
  PUBLIC: 'public',
  VENDOR: 'vendor',
};

export const APP = {
  JWT_BEARER: 'JWT',
};

export const MS_ACTIONS = {
  PROJECT: {
    SETUP: 'project.setup',
  },
  BENEFICIARY: {
    CREATE: 'beneficiary.create',
    LIST: 'beneficiary.list',
    GET: 'beneficiary.get',
    DELETE: 'beneficiary.delete',
    ADD_TO_PROJECT: 'beneficiary.add_to_project',
    BULK_ADD_TO_PROJECT: 'beneficiary.bulk_add_to_project',
    ASSGIN_TO_PROJECT: 'beneficiary.assign_to_project',
    ASSGIN_GROUP_TO_PROJECT: 'beneficiary.assign_group_to_project',
    BULK_ASSIGN_TO_PROJECT: 'beneficiary.bulk_assign',
    LIST_BY_PROJECT: 'beneficiary.list_by_project',
    GET_PROJECT_SPECIFIC: 'beneficiary.project_specific',
  },
  VENDOR: {
    REGISTER: 'vendor.register',
    ASSIGN_TO_PROJECT: 'vendor.assign_to_project',
    LIST_BY_PROJECT: 'vendor.list_by_project',
  },
  USER: {},
  ELPROJECT: {
    REDEEM_VOUCHER: 'elProject.redeemVoucher',
    UPDATE_STATUS: 'elProject.updateStatus',
    PROCESS_OTP: 'elProject.processOtp',
    SEND_SUCCESS_MESSAGE: 'elProject.successMessage',
    ASSIGN_DISCOUNT_VOUCHER: 'elProject.discountVoucher',
    REQUEST_REDEMPTION: 'elProject.requestRedemption',
    REQUEST_REDEMPTION_BE: 'elProject.requestRedemption_be',
    UPDATE_REDEMPTION: 'elProject.updateRedemption',
    LIST_REDEMPTION: 'elProject.listRedemption',
    GET_VENDOR_REDEMPTION: 'elProject.vendorRedemption',
    GET_VENDOR_REFERRER: 'elProject.beneficiaryReferred',
    GET_ALL_STATS: 'elProject.getAllStats',
    LIST_BEN_VENDOR_COUNT: 'elProject.count_ben_vendor',
    GET_VENDOR_STATS: 'elProject.getVendorStats',
  },
  SETTINGS: {
    LIST: 'settings.list',
    GET: 'settings.get',
    ADD: 'settings.add',
  },
  AAPROJECT: {
    RIVER_STATIONS: {
      GET_DHM: 'aaProject.riverStations.getDhm'
    },
    WATER_LEVELS: {
      GET_DHM: 'aaProject.waterLevels.getDhm',
      GET_GLOFAS: 'aaProject.waterLevels.getGlofas',
    },
    TRIGGERS: {
      DEV_ONLY: 'aaProject.triggers.devOnly',
      GET_ALL: 'aaProject.triggers.getAll',
      GET_ONE: 'aaProject.triggers.getOne',
      ADD: 'aaProject.triggers.add',
      REMOVE: 'aaProject.triggers.remove',
      ACTIVATE: 'aaProject.triggers.activate',
    },
    ACTIVITIES: {
      GET_ONE: 'aaProject.activities.getOne',
      GET_ALL: 'aaProject.activities.getAll',
      ADD: 'aaProject.activities.add',
      REMOVE: 'aaProject.activities.remove',
      UPDATE: 'aaProject.activities.update',
      UPDATE_STATUS: 'aaProject.activities.updateStatus',
    },
    COMMUNICATION: {
      ADD: 'aaProject.activities.communication.add',
      TRIGGER: 'aaProject.activities.communication.trigger',
      COMMUNICATION_LOGS: 'aa.jobs.communication.getCommunicationLogs',
    },
    ACTIVITY_CATEGORIES: {
      GET_ALL: 'aaProject.activityCategories.getAll',
      ADD: 'aaProject.activityCategories.add',
      REMOVE: 'aaProject.activityCategories.remove'
    },
    HAZARD_TYPES: {
      GET_ALL: 'aaProject.hazardTypes.getAll',
    },
    PHASES: {
      GET_ONE: 'aaProject.phases.getOne',
      GET_ALL: 'aaProject.phases.getAll',
      GET_STATS: 'aaProject.phases.getStats',
      ADD_TRIGGERS: 'aaProject.phases.addTriggers',
      REVERT_PHASE: 'aaProject.phases.revertPhase',
    },
    STAKEHOLDERS: {
      GET_ALL: 'aaProject.stakeholders.getAll',
      ADD: 'aaProject.stakeholders.add',
      REMOVE: 'aaProject.stakeholders.remove',
      UPDATE: 'aaProject.stakeholders.update',
      GET_GROUP: 'aaProject.stakeholders.getGroup',
      GET_ALL_GROUPS: 'aaProject.stakeholders.getAllGroups',
      GET_ONE_GROUP: 'aaProject.stakeholders.getOneGroup',
      ADD_GROUP: 'aaProject.stakeholders.addGroup',
      UPDATE_GROUP: 'aaProject.stakeholders.updateGroup',
      DELETE_GROUP: 'aaProject.stakeholders.deleteGroup',
    },
    CONTRACT: {
      INCREASE_BUDEGET: 'aaProject.contract.increase_budget'
    },
    BENEFICIARY: {
      ADD_GROUP: 'aaProject.beneficiary.addGroup',
      GET_ALL_GROUPS: 'aaProject.beneficiary.getAllGroups',
      GET_ONE_GROUP: 'aaProject.beneficiary.getOneGroup',
      ASSIGN_TOKEN_TO_GROUP: 'aaProject.beneficiary.assign_token_to_group',
      RESERVE_TOKEN_TO_GROUP: 'aaProject.beneficiary.reserve_token_to_group',
      GET_ALL_TOKEN_RESERVATION: 'aaProject.beneficiary.get_all_token_reservation',
      GET_ONE_TOKEN_RESERVATION: 'aaProject.beneficiary.get_one_token_reservation',
      GET_RESERVATION_STATS: 'aaProject.beneficiary.get_reservation_stats'
    },
    STATS: {
      GET_COMMS: 'aaProject.stats.getComms',
      GET_ALL: 'aaProject.stats.getAll',
      GET_ONE: 'aaProject.stats.getOne',
    },
    DAILY_MONITORING: {
      ADD: 'aaProject.dailyMonitoring.add',
      GET_ALL: 'aaProject.dailyMonitoring.getAll',
      GET_ONE: 'aaProject.dailyMonitoring.getOne',
      UPDATE: 'aaProject.dailyMonitoring.update',
      REMOVE: 'aaProject.dailyMonitoring.remove',
    }
  },
  C2CProject: {
    UPDATE_STATUS: 'c2cProject.updateStatus',
    LIST_BEN_COUNT: 'c2cProject.count_ben',
    CREATE_DISBURSEMENT: 'c2cProject.disbursement.create',
    GET_ALL_DISBURSEMENT: 'c2cProject.disbursements.get',
    GET_DISBURSEMENT: 'c2cProject.disbursement.getOne',
    GET_DISBURSEMENT_TRANSACTIONS: 'c2cProject.disbursement.transactions.get',
    GET_DISBURESEMENT_APPROVALS: 'c2cProject.disbursement.approvals.get',
    UPDATE_DISBURSEMENT: 'c2cProject.disbursement.update',
    //TEMP SOLUTION
    CREATE_SAFE_TRANSACTION: 'c2cProject.createSafeTransaction',
    GET_SAFE_TRANSACTION: 'c2cProject.getSafeTransaction',
    CREATE_CAMPAIGN: 'c2cProject.campaign.create',
    CREATE_AUDIENCE: 'c2cProject.campaign.create_audience',
    GET_ALL_CAMPAIGN: 'c2cProject.campaign.get',
    GET_CAMPAIGN: 'c2cProject.campaign.getOne',
    GET_ALL_TRANSPORT: 'c2cProject.campaign.get_transport',
    GET_ALL_AUDIENCE: 'c2cProject.campaign.get_audience',
    TRIGGER_CAMPAIGN: 'c2cProject.campaign.trigger',
    GET_ALL_COMMUNICATION_LOGS: 'c2cProject.campaign.communication_logs',
    GET_ALL_COMMUNICATION_STATS: 'c2cProject.campaign.communication_stats',
  },
  CVAProject: {
    UPDATE_STATUS: 'cvaProject.updateStatus',
    REQUEST_TOKEN: 'cvaProject.requestToken',
    REQUEST_CLAIM: 'cvaProject.requestClaim',
    UPDATE_CLAIM: 'cvaProject.updateClaim',
    LIST_CLAIM: 'cvaProject.listClaim',
    GET_CLAIM: 'cvaProject.getClaim',
    PROCESS_OTP: 'cvaProject.processOtp',
    CREATE_CAMPAIGN: 'cvaProject.campaign.create',
    CREATE_AUDIENCE: 'cvaProject.campaign.create_audience',
    GET_ALL_CAMPAIGN: 'cvaProject.campaign.get',
    GET_CAMPAIGN: 'cvaProject.campaign.getOne',
    GET_ALL_TRANSPORT: 'cvaProject.campaign.get_transport',
    GET_ALL_AUDIENCE: 'cvaProject.campaign.get_audience',
    TRIGGER_CAMPAIGN: 'cvaProject.campaign.trigger',
    GET_ALL_COMMUNICATION_LOGS: 'cvaProject.campaign.communication_logs',
    GET_ALL_COMMUNICATION_STATS: 'cvaProject.campaign.communication_stats',


  },
  RPPROJECT: {
    CREATE_DISBURSEMENT: 'rpProject.disbursement.create',
    GET_ALL_DISBURSEMENT: 'rpProject.disbursements.get',
    GET_DISBURSEMENT: 'rpProject.disbursement.getOne',
    UPDATE_DISBURSEMENT: 'rpProject.disbursement.update',
    CREATE_DISBURSEMENT_PLAN: 'rpProject.disbursementPlan.create',
    GET_DISBURSEMENT_PLAN: 'rpProject.disbursementPlan.getOne',
    GET_ALL_DISBURSEMENT_PLAN: 'rpProject.disbursementPlan.get',
    UPDATE_DISBURSEMENT_PLAN: 'rpProject.disbursementPlan.update',
    CREATE_BULK_DISBURSEMENT: 'rpProject.disbursement.bulkCreate',
    CREATE_CAMPAIGN: 'rpProject.campaign.create',
    CREATE_AUDIENCE: 'rpProject.campaign.create_audience',
    GET_ALL_CAMPAIGN: 'rpProject.campaign.get',
    GET_CAMPAIGN: 'rpProject.campaign.getOne',
    GET_ALL_TRANSPORT: 'rpProject.campaign.get_transport',
    GET_ALL_AUDIENCE: 'rpProject.campaign.get_audience',
    TRIGGER_CAMPAIGN: 'rpProject.campaign.trigger',
    GET_ALL_COMMUNICATION_LOGS: 'rpProject.campaign.communication_logs',
    GET_ALL_COMMUNICATION_STATS: 'rpProject.campaign.communication_stats',
    REQUEST_REDEMPTION: 'rpProject.requestRedemption',
    UPDATE_REDEMPTION: 'rpProject.updateRedemption',
    LIST_REDEMPTION: 'rpProject.listRedemption',
    GET_VENDOR_REDEMPTION: 'rpProject.vendorRedemption',
  }
};
