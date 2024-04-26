
import {
  AAJobs,
  MS_ACTIONS
} from '@rahataid/sdk';
import { ProjectActionFunc } from '@rahataid/sdk/project/project.types';

export const aaActions: ProjectActionFunc = {
  /***********************
   * Development Only
  *************************/
  [MS_ACTIONS.AAPROJECT.SCHEDULE.DEV_ONLY]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: AAJobs.SCHEDULE.DEV_ONLY, uuid }, payload),
  /************************/

  [MS_ACTIONS.AAPROJECT.SCHEDULE.ADD]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: AAJobs.SCHEDULE.ADD, uuid }, payload),

  [MS_ACTIONS.AAPROJECT.SCHEDULE.REMOVE]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: AAJobs.SCHEDULE.REMOVE, uuid }, payload),

  [MS_ACTIONS.AAPROJECT.SCHEDULE.GET_ALL]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: AAJobs.SCHEDULE.GET_ALL, uuid }, {}),

  [MS_ACTIONS.AAPROJECT.RIVER_STATIONS.GET_DHM]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: AAJobs.RIVER_STATIONS.GET_DHM, uuid }, {}),

  [MS_ACTIONS.AAPROJECT.WATER_LEVELS.GET_DHM]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: AAJobs.WATER_LEVELS.GET_DHM, uuid }, {}),

  [MS_ACTIONS.AAPROJECT.ACTIVITIES.ADD]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: AAJobs.ACTIVITIES.ADD, uuid }, payload),

  [MS_ACTIONS.AAPROJECT.ACTIVITIES.REMOVE]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: AAJobs.ACTIVITIES.REMOVE, uuid }, payload),

  [MS_ACTIONS.AAPROJECT.ACTIVITIES.GET_ALL]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: AAJobs.ACTIVITIES.GET_ALL, uuid }, payload),

  [MS_ACTIONS.AAPROJECT.ACTIVITY_CATEGORIES.GET_ALL]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: AAJobs.ACTIVITY_CATEGORIES.GET_ALL, uuid }, payload),

  [MS_ACTIONS.AAPROJECT.ACTIVITY_CATEGORIES.ADD]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: AAJobs.ACTIVITY_CATEGORIES.ADD, uuid }, payload),

  [MS_ACTIONS.AAPROJECT.ACTIVITY_CATEGORIES.REMOVE]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: AAJobs.ACTIVITY_CATEGORIES.REMOVE, uuid }, payload),

  [MS_ACTIONS.AAPROJECT.HAZARD_TYPES.GET_ALL]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: AAJobs.HAZARD_TYPES.GET_ALL, uuid }, {}),

  [MS_ACTIONS.AAPROJECT.PHASES.GET_ALL]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: AAJobs.PHASES.GET_ALL, uuid }, {}),

  [MS_ACTIONS.AAPROJECT.PHASES.GET_STATS]: (uuid, payload, sendCommand) =>
    sendCommand({ cmd: AAJobs.PHASES.GET_STATS, uuid }, {})
};