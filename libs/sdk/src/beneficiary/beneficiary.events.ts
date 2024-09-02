export const EVENTS = {
  BENEFICIARY_CHANGED: 'beneficiary.changed',
  BENEFICIARY_CREATED: 'beneficiary.created',
  BENEFICIARY_REMOVED: 'beneficiary.removed',
  BENEFICIARY_UPDATED: 'beneficiary.updated',
  BENEFICIARY_ASSIGNED_TO_PROJECT: 'beneficiary.projectAssigned'
};

export const JOBS = {
  LIST_TEMP_GROUPS: 'rahat.jobs.beneficiary.list_temp_groups',
  LIST_TEMP_BENEFICIARY: 'rahat.jobs.beneficiary.list_temp_beneficiary',
  LIST_PII: 'rahat.jobs.beneficiary.list_pii',
  CREATE: 'rahat.jobs.beneficiary.create',
  CREATE_BULK: 'rahat.jobs.beneficiary.create_bulk',
  GET: 'rahat.jobs.beneficiary.get',
  GET_PROJECT_SPECIFIC: 'rahat.jobs.beneficiary.get_project_specific',
  GET_BY_WALLET: 'rahat.jobs.beneficiary.get_by_wallet',
  GET_BY_PHONE: 'rahat.jobs.beneficiary.get_by_phone',
  GET_TABLE_STATS: 'rahat.jobs.beneficiary.get_from_stats_table',
  LIST: 'rahat.jobs.beneficiary.list',
  LIST_PROJECT_PII: 'rahat.jobs.beneficiary.list_project_pii',
  REMOVE: 'rahat.jobs.beneficiary.remove',
  ADD_TO_PROJECT: 'rahat.jobs.beneficiary.add_to_project',
  BULK_ADD_TO_PROJECT: 'rahat.jobs.beneficiary.bulk_add_to_project',
  ASSIGN_TO_PROJECT: 'rahat.jobs.beneficiary.assign_to_project',
  ASSIGN_GROUP_TO_PROJECT: 'rahat.jobs.beneficiary.assign_group_to_project',
  BULK_ASSIGN_TO_PROJECT: 'rahat.jobs.beneficiary.bulk_assign',
  BULK_REFER_TO_PROJECT: 'rahat.jobs.beneficiary.bulk_refer_to_project',
  STATS: 'rahat.jobs.beneficiary.stats',
  PROJECT_STATS: 'rahat.jobs.beneficiary.project.stats',
  UPDATE: 'rahat.jobs.beneficiary.update',
  DELETE: 'rahat.jobs.beneficiary.dekete',
  UPDATE_STATS: 'rahat.jobs.beneficiary.update_stats',
  GENERATE_LINK: 'rahat.jobs.beneficiary.generate_link',
  SEND_EMAIL: 'rahat.jobs.beneficiary.send_email',
  VALIDATE_WALLET: 'rahat.jobs.beneficiary.validate_wallet',
  VERIFY_SIGNATURE: 'rahat.jobs.beneficiary.verify_signature',
  LIST_BY_PROJECT: 'rahat.jobs.beneficiary.list_by_project',
  LIST_GROUP_BY_PROJECT: 'rahat.jobs.beneficiary.list_group_by_project',
  GET_ONE_GROUP_BY_PROJECT: 'rahat.jobs.beneficiary.get_one_group_by_project',
  VENDOR_REFERRAL: 'rahat.jobs.beneficiary.get_referred',
  LIST_REFERRAL: 'rahat.jobs.beneficiary.list_referred',
  LIST_BEN_VENDOR_COUNT: 'rahat.jobs.beneficiary.count_ben_vendor',
  LIST_BENEFICIARY_COUNT: 'rahat.jobs.beneficiary.count_beneficiary',
  ADD_GROUP: 'rahat.jobs.beneficiary.add_group',
  GET_ONE_GROUP: 'rahat.jobs.beneficiary.get_one_group',
  GET_ALL_GROUPS: 'rahat.jobs.beneficiary.get_all_groups',
  UPDATE_GROUP: 'rahat.jobs.beneficiary.update_group',
  ADD_GROUP_TO_PROJECT: 'rahat.jobs.beneficiary.add_group_to_project',
  GET_BENEFICIARIES_DISBURSEMENTS: 'rahat.jobs.beneficiaries.getDisBURSEMENTS',
  IMPORT_BENEFICIARIES_FROM_COMMUNITY_TOOL: 'rahat.jobs.beneficiary.import_beneficiaries_from_community_tool',
  IMPORT_TEMP_BENEFICIARIES: 'rahat.jobs.import_temp_beneficiaries',
  CREATE_DISBURSEMENT: 'rahat.jobs.disbursement.create',
  LIST_DISBURSEMENT: 'rahat.jobs.disbursement.list',
  LISTONE_DISBURSEMENT: 'rahat.jobs.disbursement.listone',
  UPDATE_DISBURSEMENT: 'rahat.jobs.disbursement.update',
  GET_DISBURSEMENT_TRANSACTIONS: 'rahat.jobs.disbursement.transactions.get',
  GET_DISBURSEMENT_APPROVALS: 'rahat.jobs.disbursement.approvals.get',
  CREATE_SAFE_TRANSACTION: 'rahat.jobs.safe_transaction.create',
  GET_SAFE_TRANSACTION: 'rahat.jobs.safe_transaction.get',
  REMOVE_ONE_GROUP: 'rahat.jobs.beneficiary.remove_one_group',
  GET_STATS: 'rahat.jobs.projects.get_stats',
  GET_ALL_STATS: 'rahat.jobs.projects.get_all_stats',
};
